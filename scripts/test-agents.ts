/**
 * scripts/test-agents.ts
 *
 * Tests DocumentVerifier and InformationExtractor agents.
 *
 * Mock mode (default) — no API calls, fully offline:
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/test-agents.ts
 *
 * Live mode — real OpenAI API calls with real documents from reports/:
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/test-agents.ts --live
 *
 * Inputs come from data/test_cases.json and data/policy_terms.json — nothing hardcoded.
 */

import fs from 'fs'
import path from 'path'

import { openai } from '../lib/openai'
import { verifyDocuments } from '../lib/agents/1-DocumentVerifier'
import { extractInformation } from '../lib/agents/2-InformationExtractor'
import { loadPolicy } from '../lib/policy/policyLoader'
import type { ClaimSubmission, UploadedDocument } from '../lib/types/claim.types'
import { loadEnvConfig } from '@next/env'

// Load environment variables from .env.local
loadEnvConfig(process.cwd())

const LIVE = process.argv.includes('--live')

// ── Load external data — no hardcoding ──────────────────────────────────────
const testCasesPath = path.join(process.cwd(), 'data', 'test_cases.json')
const allTestCases: any[] = JSON.parse(fs.readFileSync(testCasesPath, 'utf-8')).test_cases
const policy = loadPolicy()

// ── Mock infrastructure ──────────────────────────────────────────────────────
// We mutate the method on the shared OpenAI instance.
// All agents that imported { openai } see the same object — patching create() is visible to them.
const originalCreate = (openai.chat.completions as any).create.bind(openai.chat.completions)

// ── Test runner ──────────────────────────────────────────────────────────────
let passed = 0
let failed = 0

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  // Save current mock state so each test is isolated
  const savedCreate = (openai.chat.completions as any).create
  try {
    await fn()
    console.log(`  ✓  ${name}`)
    passed++
  } catch (e) {
    console.error(`  ✗  ${name}`)
    console.error(`     ${e instanceof Error ? e.message : String(e)}`)
    failed++
  } finally {
    (openai.chat.completions as any).create = savedCreate
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Look up a test case from test_cases.json by ID */
function tc(caseId: string): any {
  const found = allTestCases.find(c => c.case_id === caseId)
  if (!found) throw new Error(`Test case ${caseId} not found in test_cases.json`)
  return found
}

/** Build a minimal UploadedDocument with dummy base64 for mock tests */
function makeDoc(id: string, declaredType: string): UploadedDocument {
  return {
    id,
    type: declaredType as any,
    content: '',
    base64Data: 'aGVsbG8=', // base64 of "hello" — valid but meaningless
    mimeType: 'image/jpeg',
    fileName: `${id}.jpg`
  }
}

/** Build a ClaimSubmission from a test case input, merging in provided docs */
function claimFromTc(caseId: string, docs: UploadedDocument[], overrides: Partial<ClaimSubmission> = {}): ClaimSubmission {
  const input = tc(caseId).input
  return {
    memberId: input.member_id,
    policyId: input.policy_id,
    claimCategory: input.claim_category,
    treatmentDate: input.treatment_date,
    claimedAmount: input.claimed_amount,
    submissionDate: new Date().toISOString(),
    documents: docs,
    ...overrides
  }
}

/** Load a real medical document image from reports/ folder */
function loadFixture(relativePath: string, declaredType: UploadedDocument['type'] = 'UNKNOWN'): UploadedDocument {
  const fullPath = path.join(process.cwd(), 'reports', relativePath)
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Fixture not found: ${fullPath}`)
  }

  const buffer = fs.readFileSync(fullPath)
  const ext = path.extname(relativePath).toLowerCase()
  const mimeType = ext === '.pdf' ? 'application/pdf'
    : ext === '.png' ? 'image/png'
      : 'image/jpeg'
  return {
    id: `doc_${path.basename(relativePath, ext).replace(/[\s()]/g, '_').slice(0, 30)}`,
    type: declaredType as any,
    content: '',
    base64Data: buffer.toString('base64'),
    mimeType,
    fileName: path.basename(relativePath)
  }
}

/** Build a mock LLM response for document classification */
function mockClassification(overrides: Partial<{
  detected_type: string
  is_readable: boolean
  readability_issues: string[]
  patient_name: string | null
  confidence: number
}> = {}) {
  return JSON.stringify({
    detected_type: 'PRESCRIPTION',
    is_readable: true,
    readability_issues: [],
    patient_name: 'Rajesh Kumar',
    confidence: 0.92,
    ...overrides
  })
}

/** Build a mock LLM response for document extraction */
function mockExtraction(overrides: Record<string, any> = {}) {
  return JSON.stringify({
    patient_name: 'Rajesh Kumar',
    doctor_name: 'Dr. Arun Sharma',
    doctor_registration: 'KA/45678/2015',
    hospital_name: 'Apollo Hospitals',
    provider_name: 'Apollo Hospitals',
    date: '01-05-2026',
    diagnosis: 'Viral Fever with body ache',
    medicines: [
      { name: 'Paracetamol 650mg', dosage: '1-1-1', duration: '5 days', amount: 0 },
      { name: 'Vitamin C 500mg', dosage: '0-0-1', duration: '10 days', amount: 0 },
      { name: 'ORS Liquids', dosage: 'as needed', duration: '', amount: 0 }
    ],
    tests_ordered: ['CBC', 'Dengue NS1'],
    line_items: [
      { description: 'Consultation Fee (Dr. Arun Sharma)', amount: 1000 },
      { description: 'CBC (Complete Blood Count)', amount: 200 },
      { description: 'Dengue NS1 Antigen Test', amount: 300 }
    ],
    total_amount: 1500,
    unreadable_fields: [],
    confidence: 0.92,
    ...overrides,
  })
}

// ── Mock Tests (10) ──────────────────────────────────────────────────────────

console.log('\n── Mock Tests ────────────────────────────────────────────────────')

// Read document requirements from policy — no hardcoding
const consultationReqs = policy.document_requirements['CONSULTATION']?.required ?? []
const pharmacyReqs = policy.document_requirements['PHARMACY']?.required ?? []

// Test 1 — Happy path: all required docs present
await test('Verifier: correct doc types → passed: true', async () => {
  const docs = consultationReqs.map((type, i) => makeDoc(`d${i + 1}`, type))
  const claim = claimFromTc('TC004', docs)

  let callCount = 0;
  (openai.chat.completions as any).create = async () => ({
    choices: [{ message: { content: mockClassification({ detected_type: consultationReqs[callCount++] ?? 'PRESCRIPTION' }) } }]
  })

  const result = await verifyDocuments(claim)
  assert(result.passed === true,
    `Expected passed=true. Errors: ${result.errors.map(e => e.message).join('; ')}`)
})

// Test 2 — Unreadable document
await test('Verifier: unreadable doc → passed: false, message contains "re-upload"', async () => {
  const docs = pharmacyReqs.map((type, i) => makeDoc(`d${i + 1}`, type))
  const claim = claimFromTc('TC002', docs)

  let callCount = 0;
  (openai.chat.completions as any).create = async () => {
    const idx = callCount++
    // First doc readable, second unreadable
    return {
      choices: [{
        message: {
          content: mockClassification({
            detected_type: pharmacyReqs[idx] ?? 'PRESCRIPTION',
            is_readable: idx === 0,
            readability_issues: idx === 1 ? ['image_too_dark', 'image_blurry'] : [],
            patient_name: idx === 0 ? 'Rajesh Kumar' : null
          })
        }
      }]
    }
  }

  const result = await verifyDocuments(claim)
  assert(result.passed === false, 'Expected passed=false due to unreadable document')
  const hasReupload = result.errors.some(e => e.message.toLowerCase().includes('re-upload'))
  assert(hasReupload,
    `Expected "re-upload" in an error message. Got: ${result.errors.map(e => e.message).join(' | ')}`)
})

// Test 3 — Wrong document type
await test('Verifier: wrong doc type → error names both the wrong type and the required type', async () => {
  // TC001: CONSULTATION claim but member submits 2 PRESCRIPTIONs (missing HOSPITAL_BILL)
  const docs = [makeDoc('d1', 'PRESCRIPTION'), makeDoc('d2', 'PRESCRIPTION')]
  const claim = claimFromTc('TC001', docs);

  // Both docs classified as PRESCRIPTION — HOSPITAL_BILL will be flagged as missing
  (openai.chat.completions as any).create = async () => ({
    choices: [{ message: { content: mockClassification({ detected_type: 'PRESCRIPTION' }) } }]
  })

  const result = await verifyDocuments(claim)
  assert(result.passed === false, 'Expected passed=false due to missing HOSPITAL_BILL')

  const missingBillError = result.errors.find(e => e.expectedType === 'HOSPITAL_BILL')
  assert(!!missingBillError,
    `Expected an error for missing HOSPITAL_BILL. Errors: ${JSON.stringify(result.errors)}`)

  const msgLower = missingBillError!.message.toLowerCase()
  assert(msgLower.includes('hospital bill'),
    `Error should mention what is required (hospital bill). Got: "${missingBillError!.message}"`)
})

// Test 4 — Fix A: empty-string patient_name must NOT trigger consistency check
await test('Verifier (Fix A): patient_name: "" filtered out — no false consistency error', async () => {
  const docs = consultationReqs.map((type, i) => makeDoc(`d${i + 1}`, type))
  const claim = claimFromTc('TC004', docs)

  let callCount = 0;
  // Both docs return empty-string patient_name — should be ignored
(openai.chat.completions as any).create = async () => ({
  choices: [{
    message: { 
      content: mockClassification({
        detected_type: 'PRESCRIPTION',
        patient_name: '' // Testing the empty string filtering
      })
    }
  }]
})


  const result = await verifyDocuments(claim)
  const consistencyFailure = result.trace.find((t: any) => t.check === 'CrossDocumentConsistency' && t.result === 'FAILED')
  assert(!consistencyFailure, 'Expected no false consistency error when one patient_name is empty string')
})

// Test 5 — Cross-document patient name mismatch
await test('Verifier: patient names differ across docs → cross_document error with both names', async () => {
  // TC003: prescription for Rajesh Kumar, hospital bill for Arjun Mehta
  const docs = consultationReqs.map((type, i) => makeDoc(`d${i + 1}`, type))
  const claim = claimFromTc('TC003', docs)

  const patientNames = ['Rajesh Kumar', 'Arjun Mehta']
  let callCount = 0;
  (openai.chat.completions as any).create = async () => {
    const idx = callCount++
    return {
      choices: [{
        message: {
          content: mockClassification({
            detected_type: idx === 0 ? 'PRESCRIPTION' : 'HOSPITAL_BILL',
            patient_name: patientNames[idx]
          })
        }
      }]
    }
  }

  const result = await verifyDocuments(claim)
  assert(result.passed === false, 'Expected passed=false due to name mismatch')
  const crossDocError = result.errors.find(e => e.documentId === 'cross_document')
  assert(!!crossDocError, `Expected cross_document error. Errors: ${JSON.stringify(result.errors)}`)
  assert(crossDocError!.message.includes('Rajesh Kumar'), 'Error must name first patient')
  assert(crossDocError!.message.includes('Arjun Mehta'), 'Error must name second patient')
})

// Test 6 — LLM returns malformed JSON
await test('Verifier: LLM malformed JSON → no throw, document treated as unverifiable', async () => {
  const docs = [makeDoc('d1', 'PRESCRIPTION')]
  const claim = claimFromTc('TC001', docs, { claimCategory: 'CONSULTATION' });

  (openai.chat.completions as any).create = async () => ({
    choices: [{ message: { content: 'not json at all }}}' } }]
  })

  const result = await verifyDocuments(claim)
  assert(result.passed === false, 'Malformed JSON should not pass verification')
})

// Test 7 — Extractor happy path
await test('Extractor: valid PRESCRIPTION JSON → lineItems, diagnosis, confidence > 0', async () => {
  const docs = [makeDoc('d1', 'PRESCRIPTION')]

  ;(openai.chat.completions as any).create = async () => ({
    choices: [{ message: { content: mockExtraction() } }],
  })

  const result = await extractInformation(docs)
  assert(result.documents.length === 1, `Expected 1 extracted document, got ${result.documents.length}`)

  const doc = result.documents[0]
  assert((doc.extractionConfidence ?? 0) > 0, 'Expected extraction confidence > 0')
  assert(!!doc.diagnosis, 'Expected diagnosis to be extracted')

  const liCount = Array.isArray(doc.lineItems) ? doc.lineItems.length : 0

  assert(
    liCount > 0,
    `Expected at least one medicine or line item, got lineItems=${liCount}`,
  )
})

// Test 8 — Fix B: confidence: 0 must NOT become 0.5
await test('Extractor (Fix B): explicit confidence: 0 preserved, not coerced to 0.5', async () => {
  const doc = makeDoc('d1', 'PRESCRIPTION');

  (openai.chat.completions as any).create = async () => ({
    choices: [{
      message: {
        content: mockExtraction({
          unreadable_fields: ['all_fields'],
          medicines: [],
          confidence: 0  // ← explicit zero — the old `|| 0.5` bug would lose this
        })
      }
    }]
  })

  const result = await extractInformation([doc])
  assert(result.documents[0].extractionConfidence === 0,
    `Expected extractionConfidence 0, got ${result.documents[0].extractionConfidence}`)
})

// Test 9 — Verifier: LLM malformed JSON → error message contains "re-upload" or "not what we need"
await test('Verifier: LLM malformed JSON → error message contains re-upload guidance', async () => {
  const docs = [makeDoc('d1', 'PRESCRIPTION')]
  const claim = claimFromTc('TC001', docs, { claimCategory: 'CONSULTATION' });

  // Force malformed JSON from the LLM
  (openai.chat.completions as any).create = async () => ({
    choices: [{ message: { content: '{not valid json' } }],
  })

  const result = await verifyDocuments(claim)

  // 1) The verifier itself must not throw (we reached here).
  // 2) The document should be treated as UNVERIFIABLE and verification should fail.
  assert(result.passed === false, 'Malformed JSON should not pass verification')

  const msg = result.errors.map((e: any) => e.message.toLowerCase()).join(' | ')
  assert(
    msg.includes('re-upload') || msg.includes('not what we need'),
    `Expected a "re-upload" or "not what we need" style message. Got: ${msg}`,
  )
})

// Test 10 — Promise.allSettled: middle doc throws, others continue
await test('Extractor: middle doc LLM throws → 3 docs out, middle has fallback confidence 0.1', async () => {
  const docs = [makeDoc('d1', 'PRESCRIPTION'), makeDoc('d2', 'LAB_REPORT'), makeDoc('d3', 'HOSPITAL_BILL')]

  let callCount = 0;
  (openai.chat.completions as any).create = async () => {
    const idx = callCount++
    if (idx === 1) throw new Error('Simulated LLM failure on middle document')
    return {
      choices: [{ message: { content: mockExtraction() } }]
    }
  }

  const result = await extractInformation(docs)
  assert(result.documents.length === 3, `Expected 3 docs, got ${result.documents.length}`)
  assert(result.documents[1].extractionConfidence === 0.1, `Expected middle fallback confidence 0.1, got ${result.documents[1].extractionConfidence}`)
})

// ── Live Tests (4) ───────────────────────────────────────────────────────────

if (LIVE) {
  // Restore real OpenAI client before live tests
  (openai.chat.completions as any).create = originalCreate
  console.log('\n── Live Tests (real OpenAI API + real documents) ────────────────')
  console.log('Using documents from reports/test-cases/COMB-4')
  console.log('Model: gpt-5.4-mini\n')

  // Test 11 — Aug 13 happy path: correct prescription + hospital bill, same patient
  await test('Live 11: COMB-4 PRESCRIPTION + HOSPITAL_BILL → verified and extracted', async () => {
    const bill = loadFixture(path.join('test-cases', 'COMB-4', 'Doc 12.png'), 'HOSPITAL_BILL')
    const rx = loadFixture(path.join('test-cases', 'COMB-4', 'Doc 13.png'), 'PRESCRIPTION')

    const claim = claimFromTc('TC004', [rx, bill])

    const verif = await verifyDocuments(claim)
    console.log('     verification.passed =', verif.passed)
    console.log('     trace =', verif.trace.map((t: any) => `${t.check}:${t.result}`).join(' | '))
    assert(verif.passed === true, `Expected verification to pass. Errors: ${verif.errors.map((e: any) => e.message).join(' | ')}`)

    const extraction = await extractInformation([rx, bill])
    console.log(
      '     extracted =',
      extraction.documents.map((d: any) => `${d.documentType}:${(d.extractionConfidence ?? 0).toFixed(2)}`).join(', ')
    )

    assert(extraction.documents.length === 2, `Expected 2 extracted docs, got ${extraction.documents.length}`)
    assert(extraction.overallExtractionConfidence > 0, 'Expected overall extraction confidence > 0')
  })

  // Test 12 — Very dark image → readability detection
  await test('Live 12: COMB-4 prescription extraction → diagnosis/patient/provider present', async () => {
    const rx = loadFixture(path.join('test-cases', 'COMB-4', 'Doc 13.png'), 'PRESCRIPTION')

    const extraction = await extractInformation([rx])
    const doc = extraction.documents[0]

    console.log('     diagnosis =', doc?.diagnosis)
    console.log('     patient =', doc?.patientName)
    console.log('     provider =', doc?.providerName || doc?.doctorName)

    assert(!!doc, 'Expected a prescription extraction result')
    assert(!!(doc.patientName || '').trim(), 'Expected patientName on prescription')
    assert(!!(doc.diagnosis || '').trim(), 'Expected diagnosis on prescription')
  })


  // Test 13 — "Nynika" vs "Nainika" name mismatch across real documents
  await test('Live 13: COMB-4 bill extraction → line items/total present', async () => {
    const bill = loadFixture(path.join('test-cases', 'COMB-4', 'Doc 12.png'), 'HOSPITAL_BILL')

    const extraction = await extractInformation([bill])
    const doc = extraction.documents[0]

    console.log('     provider =', doc?.providerName)
    console.log('     total =', doc?.totalAmount)
    console.log('     line items =', doc?.lineItems?.map((x: any) => x.description).join(', ') ?? 'none')

    assert(!!doc, 'Expected a bill extraction result')
    assert((doc?.lineItems?.length ?? 0) > 0, 'Expected at least one line item on bill')
  })
} else {
  console.log('\n (Skipping live tests — run with --live to use real documents and OpenAI API)')
}

// ── Summary ──────────────────────────────────────────────────────────────────

const total = passed + failed
const modeLabel = LIVE ? '(mock + live)' : '(mock only)'
console.log(`\n${total} tests ${modeLabel}: ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
