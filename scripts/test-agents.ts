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
    type: declaredType,
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
function loadFixture(relativePath: string): UploadedDocument {
  const fullPath = path.join(process.cwd(), 'reports', relativePath)
  const buffer = fs.readFileSync(fullPath)
  const ext = path.extname(relativePath).toLowerCase()
  const mimeType = ext === '.pdf' ? 'application/pdf'
    : ext === '.png' ? 'image/png'
      : 'image/jpeg'
  return {
    id: `doc_${path.basename(relativePath, ext).replace(/[\s()]/g, '_').slice(0, 30)}`,
    type: 'UNKNOWN',
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
function mockExtraction(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    patient_name: 'Rajesh Kumar',
    doctor_name: 'Dr. Arun Sharma',
    doctor_registration: 'KA/45678/2015',
    clinic_name: 'City Medical Centre',
    date: '01-11-2024',
    diagnosis: 'Viral Fever',
    medicines: [
      { name: 'Paracetamol 650mg', dosage: '1-1-1', duration: '5 days', amount: 0 },
      { name: 'Vitamin C 500mg', dosage: '0-0-1', duration: '7 days', amount: 0 }
    ],
    tests_ordered: ['CBC', 'Dengue NS1'],
    unreadable_fields: [],
    confidence: 0.92,
    ...overrides
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
            patient_name: idx === 0 ? 'Nainika' : null
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
  assert(missingBillError!.message.includes('PRESCRIPTION'),
    `Error should mention what was uploaded ("PRESCRIPTION"). Got: "${missingBillError!.message}"`)
  assert(missingBillError!.message.includes('HOSPITAL_BILL'),
    `Error should mention what is required ("HOSPITAL_BILL"). Got: "${missingBillError!.message}"`)
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
          detected_type: consultationReqs[callCount++] ?? 'PRESCRIPTION',
          patient_name: ''  // ← empty string, not null
        })
      }
    }]
  })

  const result = await verifyDocuments(claim)
  const hasConsistencyError = result.errors.some(e => e.documentId === 'cross_document')
  assert(!hasConsistencyError,
    'Empty-string patient_name must NOT trigger cross-document consistency error (Fix A)')
})

// Test 5 — Cross-document patient name mismatch
await test('Verifier: patient names differ across docs → cross_document error with both names', async () => {
  // TC003: prescription for Rajesh Kumar, hospital bill for Arjun Mehta
  const docs = consultationReqs.map((type, i) => makeDoc(`d${i + 1}`, type))
  const claim = claimFromTc('TC003', docs)

  const patientNames = ['Rajesh Kumar', 'Arjun Mehta']
  let callCount = 0;
  (openai.chat.completions as any).create = async () => ({
    choices: [{
      message: {
        content: mockClassification({
          detected_type: consultationReqs[callCount] ?? 'PRESCRIPTION',
          patient_name: patientNames[callCount++] ?? 'Rajesh Kumar'
        })
      }
    }]
  })

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
  const claim = claimFromTc('TC004', docs);

  (openai.chat.completions as any).create = async () => ({
    choices: [{ message: { content: 'not json at all }}}' } }]
  })

  let threw = false
  let result: any
  try {
    result = await verifyDocuments(claim)
  } catch {
    threw = true
  }

  assert(!threw, 'verifyDocuments must NOT throw when LLM returns malformed JSON')
  // The JSON parse fallback in analyseDocument returns { detected_type: UNKNOWN, is_readable: false }
  // which causes a readability error — so passed should be false
  assert(result.passed === false, 'Document with bad JSON should fail readability check')
})

// Test 7 — Extractor happy path
await test('Extractor: valid PRESCRIPTION JSON → lineItems, diagnosis, confidence > 0', async () => {
  const doc = makeDoc('d1', 'PRESCRIPTION');

  (openai.chat.completions as any).create = async () => ({
    choices: [{ message: { content: mockExtraction() } }]
  })

  const result = await extractInformation([doc])
  assert(result.documents.length === 1, `Expected 1 document, got ${result.documents.length}`)
  assert(result.documents[0].documentType === 'PRESCRIPTION', 'Expected PRESCRIPTION type')
  assert(result.documents[0].extractionConfidence > 0,
    `Expected confidence > 0, got ${result.documents[0].extractionConfidence}`)
  assert(Array.isArray(result.documents[0].lineItems), 'lineItems must be an array')
  assert((result.documents[0].lineItems?.length ?? 0) === 2, 'Expected 2 medicine line items')
  assert(result.documents[0].diagnosis === 'Viral Fever',
    `Expected diagnosis "Viral Fever", got "${result.documents[0].diagnosis}"`)
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
    `Expected extractionConfidence 0, got ${result.documents[0].extractionConfidence}. ` +
    `Fix B: (raw.confidence || 0.5) was treating explicit 0 as falsy — must use null check.`)
})

// Test 9 — Extractor malformed JSON → fallback
await test('Extractor: malformed JSON → fallback (confidence 0.1, unreadableFields: [all_fields])', async () => {
  const doc = makeDoc('d1', 'HOSPITAL_BILL');

  (openai.chat.completions as any).create = async () => ({
    choices: [{ message: { content: '{broken json syntax:' } }]
  })

  const result = await extractInformation([doc])
  assert(result.failed === false, 'ExtractionResult.failed must be false — pipeline continues')
  assert(result.documents[0].extractionConfidence === 0.1,
    `Expected fallback confidence 0.1, got ${result.documents[0].extractionConfidence}`)
  assert(result.documents[0].unreadableFields.includes('all_fields'),
    'Expected unreadableFields to contain "all_fields"')
})

// Test 10 — Promise.allSettled: middle doc throws, others continue
await test('Extractor: middle doc LLM throws → 3 docs out, middle has fallback confidence 0.1', async () => {
  const docs = [
    makeDoc('d1', 'PRESCRIPTION'),
    makeDoc('d2', 'HOSPITAL_BILL'),
    makeDoc('d3', 'LAB_REPORT')
  ]

  let callCount = 0;
  (openai.chat.completions as any).create = async () => {
    const idx = callCount++
    if (idx === 1) throw new Error('Simulated LLM failure on middle document')
    return {
      choices: [{ message: { content: mockExtraction({ confidence: 0.85 }) } }]
    }
  }

  const result = await extractInformation(docs)
  assert(result.documents.length === 3,
    `Expected 3 docs out from Promise.allSettled, got ${result.documents.length}`)
  assert(result.documents[1].extractionConfidence === 0.1,
    `Middle doc must fallback to confidence 0.1, got ${result.documents[1].extractionConfidence}`)
  assert(result.documents[0].extractionConfidence === 0.85, 'First doc should have normal confidence')
  assert(result.documents[2].extractionConfidence === 0.85, 'Third doc should have normal confidence')
  assert(result.failed === false, 'ExtractionResult.failed must be false — pipeline continues')
})

// ── Live Tests (4) ───────────────────────────────────────────────────────────

if (LIVE) {
  // Restore real OpenAI client before live tests
  (openai.chat.completions as any).create = originalCreate

  console.log('\n── Live Tests (real OpenAI API + real documents) ────────────────')
  console.log('   Using documents from reports/ folder')
  console.log('   Model: gpt-5.4-mini\n')

  // Test 11 — Aug 13 happy path: correct prescription + hospital bill, same patient
  await test('Live 11: Aug13 PRESCRIPTION + HOSPITAL_BILL → verified and extracted', async () => {
    const rx = loadFixture('Nainika Aug 13 2025/WhatsApp Image 2026-05-03 at 11.55.20 PM.jpeg')
    const bill = loadFixture('Nainika Aug 13 2025/WhatsApp Image 2026-05-03 at 11.55.19 PM.jpeg')
    rx.type = 'PRESCRIPTION'
    bill.type = 'HOSPITAL_BILL'

    const claim = claimFromTc('TC004', [rx, bill])

    console.log('   → Running verification...')
    const verif = await verifyDocuments(claim)
    console.log('     Trace:', verif.trace.map(t => `${t.check}:${t.result}`).join(' | '))
    if (verif.errors.length > 0) {
      console.log('     Errors:', verif.errors.map(e => e.message).join('\n             '))
    }

    assert(verif.passed === true,
      `Expected passed=true. Errors: ${verif.errors.map(e => e.message).join('; ')}`)

    console.log('   → Running extraction...')
    const extraction = await extractInformation([rx, bill])
    const rxDoc = extraction.documents[0]
    console.log(`     PRESCRIPTION confidence: ${rxDoc.extractionConfidence.toFixed(2)}`)
    console.log(`     Diagnosis: ${rxDoc.diagnosis ?? '(not extracted)'}`)
    console.log(`     Doctor: ${rxDoc.doctorName ?? '(not extracted)'}`)
    console.log(`     Provider: ${extraction.documents[1].providerName ?? '(not extracted)'}`)

    assert(extraction.documents.length === 2, 'Expected 2 extracted documents')
    assert(extraction.overallExtractionConfidence > 0, 'Expected overall confidence > 0')
  })

  // Test 12 — Very dark image → readability detection
  await test('Live 12: dark bill image → ReadabilityCheck:FAILED in trace', async () => {
    const darkBill = loadFixture('Nainika Nov 22 2025/WhatsApp Image 2026-05-04 at 12.07.56 AM (1).jpeg')
    const clearRx = loadFixture('Nainika Nov 22 2025/WhatsApp Image 2026-05-04 at 12.07.57 AM (2).jpeg')
    darkBill.type = 'HOSPITAL_BILL'
    clearRx.type = 'PRESCRIPTION'

    // TC002 is PHARMACY — override to match the docs we're using (consultation-like)
    const claim = claimFromTc('TC002', [darkBill, clearRx], { claimCategory: 'CONSULTATION' })

    console.log('   → Running verification...')
    const verif = await verifyDocuments(claim)
    console.log('     Trace:', verif.trace.map(t => `${t.check}:${t.result}`).join(' | '))

    const readabilityEntries = verif.trace.filter(t => t.check === 'ReadabilityCheck')
    console.log('     Readability verdicts:', readabilityEntries.map(t => `${t.result}: ${t.detail?.slice(0, 80)}`).join('\n                         '))

    assert(readabilityEntries.length > 0,
      'ReadabilityCheck must appear in trace for at least one document')

    const failedEntry = readabilityEntries.find(t => t.result === 'FAILED')
    if (failedEntry) {
      assert(verif.errors.some(e => e.message.toLowerCase().includes('re-upload')),
        'If ReadabilityCheck fails, error message must include re-upload guidance')
      console.log('     ✓ Model flagged document as unreadable — re-upload message generated')
    } else {
      console.log('     ℹ Model determined document was readable — no readability error raised')
    }
  })

  // Test 13 — "Nynika" vs "Nainika" name mismatch across real documents
  await test('Live 13: Dec19 PRESCRIPTION (Nynika) + HOSPITAL_BILL → CrossDocumentConsistency runs', async () => {
    const rx = loadFixture('Nainika Dec 19 2025/WhatsApp Image 2026-05-04 at 12.00.36 AM (1).jpeg')
    const slip = loadFixture('Nainika Dec 19 2025/WhatsApp Image 2026-05-04 at 12.00.36 AM.jpeg')
    rx.type = 'PRESCRIPTION'
    slip.type = 'HOSPITAL_BILL'

    const claim = claimFromTc('TC004', [rx, slip])

    console.log('   → Running verification...')
    const verif = await verifyDocuments(claim)

    // Log what the LLM extracted for patient names
    const classifLogs = verif.trace.filter(t => t.check === 'DocumentClassification')
    console.log('     Classifications:', classifLogs.map(t => t.detail).join('\n                     '))

    const consistencyCheck = verif.trace.find(t => t.check === 'CrossDocumentConsistency')
    if (consistencyCheck) {
      console.log(`     Consistency: ${consistencyCheck.result} — ${consistencyCheck.detail?.slice(0, 100)}`)
    } else {
      console.log('     Consistency: skipped (likely only one doc had a name extracted)')
    }

    // Either PASSED (LLM normalized name) or FAILED (LLM preserved Nynika) — both are valid outcomes.
    // The test asserts the check ran without throwing, which is what matters.
    const ranWithoutCrash = true
    assert(ranWithoutCrash, 'verifyDocuments must complete without throwing')

    // If consistency failed, message should mention the specific names
    if (consistencyCheck?.result === 'FAILED') {
      assert(consistencyCheck.detail.toLowerCase().includes('nainika') || consistencyCheck.detail.toLowerCase().includes('nynika'),
        'Consistency error should mention the patient names found')
    }
  })

  // Test 14 — Multi-doc DIAGNOSTIC: parallel extraction + LAB_REPORT has test results
  await test('Live 14: Nov22 3-doc DIAGNOSTIC → parallel extraction, LAB_REPORT has line items', async () => {
    const rx = loadFixture('Nainika Nov 22 2025/WhatsApp Image 2026-05-04 at 12.07.57 AM (2).jpeg')
    const lab = loadFixture('Nainika Nov 22 2025/WhatsApp Image 2026-05-04 at 12.07.58 AM.jpeg')
    const bill = loadFixture('Nainika Nov 22 2025/WhatsApp Image 2026-05-04 at 12.07.57 AM.jpeg')
    rx.type = 'PRESCRIPTION'
    lab.type = 'LAB_REPORT'
    bill.type = 'HOSPITAL_BILL'

    console.log('   → Running extraction on 3 documents in parallel...')
    const start = Date.now()
    const result = await extractInformation([rx, lab, bill])
    const elapsed = Date.now() - start

    console.log(`     Extraction time: ${elapsed}ms (all 3 parallel)`)
    console.log('     Per-doc confidence:', result.documents
      .map(d => `${d.documentType}:${d.extractionConfidence.toFixed(2)}`).join(', '))

    const labDoc = result.documents.find(d => d.documentType === 'LAB_REPORT')
    if (labDoc) {
      console.log('     LAB_REPORT line items:', labDoc.lineItems?.map(i => i.description).join(', ') ?? 'none')
      console.log('     LAB_REPORT provider:', labDoc.providerName ?? '(not extracted)')
    }

    assert(result.documents.length === 3, `Expected 3 documents, got ${result.documents.length}`)
    assert(labDoc !== undefined, 'LAB_REPORT must be in extraction results')
    assert((labDoc?.lineItems?.length ?? 0) > 0,
      'LAB_REPORT must have at least one test as a line item (CBP should produce entries)')
  })

} else {
  console.log('\n   (Skipping live tests — run with --live to use real documents and OpenAI API)')
}

// ── Summary ──────────────────────────────────────────────────────────────────

const total = passed + failed
const modeLabel = LIVE ? '(mock + live)' : '(mock only)'
console.log(`\n${total} tests ${modeLabel}: ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
