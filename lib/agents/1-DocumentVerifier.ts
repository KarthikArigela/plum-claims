import { ClaimSubmission, VerificationResult, TraceEntry, UploadedDocument } from '../types/claim.types'
import { loadPolicy } from '../policy/policyLoader'
import { openai, VISION_MODEL } from '../openai'

interface DocumentAnalysis {
  detected_type: string
  is_readable: boolean
  readability_issues: string[]
  patient_name: string | null
  confidence: number
}

function buildVisionContent(doc: UploadedDocument) {
  // Both images and PDFs sent as image_url with base64 data URL
  // Works across all vision-capable models
  return {
    type: 'image_url' as const,
    image_url: {
      url: `data:${doc.mimeType};base64,${doc.base64Data}`
    }
  }
}

async function analyseDocument(doc: UploadedDocument, validDocTypes: string): Promise<DocumentAnalysis> {
  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a medical document classifier for Indian health insurance claims.
Analyse the provided document image or PDF and return structured JSON only.
Be strict about readability — if key fields are obscured, declare unreadable.
Valid document types: ${validDocTypes}.
Return ONLY valid JSON. No explanation.`
      },
      {
        role: 'user',
        content: [
          buildVisionContent(doc),
          {
            type: 'text',
            text: `Analyse this Indian medical document and return JSON with this exact structure:
{
  "detected_type": "one of: ${validDocTypes}",
  "is_readable": true or false,
  "readability_issues": ["rubber_stamp_over_text", "image_blurry", "handwriting_illegible", "partial_document", "image_too_dark"],
  "patient_name": "exact name as written on document, or null if not found",
  "confidence": 0.0 to 1.0
}

Notes:
- readability_issues should only list actual problems present, can be empty array
- patient_name should be the name as written — do not correct spelling
- confidence reflects your certainty in the detected_type classification
- If the document is a photo of a handwritten prescription, detected_type is PRESCRIPTION
- If it is a hospital invoice, receipt, bill, OP-slip, or consultation receipt with a fee, detected_type is HOSPITAL_BILL
- If it is a pharmacy/medicine bill or drug invoice, detected_type is PHARMACY_BILL
- If the image is dark, shadowed, low-contrast, or requires any effort to read — 
mark is_readable: false. Err on the side of caution. A member can re-upload; extracting from a bad image causes incorrect decisions.`
          }
        ]
      }
    ]
  })

  const raw = response.choices[0].message.content || '{}'
  try {
    const parsed = JSON.parse(raw) as DocumentAnalysis
    parsed.confidence = Math.max(0, Math.min(1, parsed.confidence || 0))
    return parsed
  } catch {
    return {
      detected_type: 'UNKNOWN',
      is_readable: false,
      readability_issues: ['analysis_failed'],
      patient_name: null,
      confidence: 0
    }
  }
}

function normaliseName(name: string): string {
  const HONORIFICS = new Set(['mr', 'mrs', 'ms', 'miss', 'dr', 'prof', 'master', 'sri', 'smt', 'shri'])
  
  return name
    .toLowerCase()
    .replace(/\./g, ' ')          // dots → spaces FIRST ("Miss.NAINIKA" → "Miss NAINIKA")
    .replace(/[^a-z\s]/g, '')     // strip remaining punctuation
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(word => word.length > 0 && !HONORIFICS.has(word))
    .join(' ')
    .trim()
}

export async function verifyDocuments(claim: ClaimSubmission): Promise<VerificationResult> {
  const policy = loadPolicy()
  const requirements = policy.document_requirements[claim.claimCategory]
  const trace: TraceEntry[] = []
  const errors: VerificationResult['errors'] = []

  if (!requirements) {
    trace.push({
      stage: 'DocumentVerification',
      check: 'RequirementsLookup',
      result: 'WARNING',
      detail: `No document requirements found for category ${claim.claimCategory}. Proceeding without type check.`
    })
    return { passed: true, errors: [], trace }
  }

  // Derive valid doc types from policy — no hardcoding
  const validDocTypes = [
    ...new Set(
      Object.values(policy.document_requirements)
        .flatMap(r => [...r.required, ...r.optional])
    ),
    'UNKNOWN'
  ].join(', ')

  // ── Step 1: Analyse each document via LLM (parallel) ──────────────────────
  const docsWithData = claim.documents.filter(doc => doc.base64Data && doc.mimeType)
  const docsWithoutData = claim.documents.filter(doc => !doc.base64Data || !doc.mimeType)

  // Push errors for docs with no file data upfront
  for (const doc of docsWithoutData) {
    errors.push({
      documentId: doc.id,
      documentType: 'UNKNOWN',
      expectedType: doc.type,
      message: `Document ${doc.fileName || doc.id} could not be read — no file data received. Please re-upload the file.`
    })
    trace.push({
      stage: 'DocumentVerification',
      check: 'FileDataCheck',
      result: 'FAILED',
      detail: `Document ${doc.id} has no base64Data — skipping LLM analysis.`
    })
  }

  // Run LLM analysis for all valid docs in parallel
  const settled = await Promise.allSettled(
    docsWithData.map(doc =>
      analyseDocument(doc, validDocTypes).then(analysis => ({ ...analysis, documentId: doc.id, declared: doc.type }))
    )
  )

  const analyses: (DocumentAnalysis & { documentId: string; declared: string })[] = []

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i]
    const doc = docsWithData[i]

    if (result.status === 'fulfilled') {
      analyses.push(result.value)
      trace.push({
        stage: 'DocumentVerification',
        check: 'DocumentClassification',
        result: 'INFO',
        detail: `Document ${doc.id}: Detected as ${result.value.detected_type} (confidence: ${result.value.confidence.toFixed(2)}). Member declared: ${doc.type}.`
      })
    } else {
      // LLM failed for this doc — treat as unverifiable
      errors.push({
        documentId: doc.id,
        documentType: 'UNKNOWN',
        expectedType: doc.type,
        message: `Document ${doc.fileName || doc.id} could not be verified — please re-upload a clearer copy.`
      })
      trace.push({
        stage: 'DocumentVerification',
        check: 'DocumentClassification',
        result: 'FAILED',
        detail: `LLM analysis failed for document ${doc.id}: ${String(result.reason)}`
      })
    }
  }

  // ── Step 2: Required document type check ──────────────────────────────────
  const detectedTypes = analyses.map(a => a.detected_type)

  for (const required of requirements.required) {
    if (!detectedTypes.includes(required)) {
      const wrongDoc = analyses.find(a => !requirements.required.includes(a.detected_type))

      const message = wrongDoc
        ? `You uploaded a ${wrongDoc.detected_type} where a ${required} is required. ` +
          `For ${claim.claimCategory.toLowerCase()} claims, please upload a ${required}. ` +
          `Required documents: ${requirements.required.join(', ')}.`
        : `Missing required document: ${required}. ` +
          `${claim.claimCategory} claims require: ${requirements.required.join(', ')}.`

      errors.push({
        documentId: wrongDoc?.documentId || 'missing',
        documentType: wrongDoc?.detected_type || 'MISSING',
        expectedType: required,
        message
      })
      trace.push({
        stage: 'DocumentVerification',
        check: 'RequiredDocumentCheck',
        result: 'FAILED',
        detail: message
      })
    } else {
      trace.push({
        stage: 'DocumentVerification',
        check: 'RequiredDocumentCheck',
        result: 'PASSED',
        detail: `Required document ${required} found.`
      })
    }
  }

  // ── Step 3: Readability check ─────────────────────────────────────────────
  for (const analysis of analyses) {
    if (!analysis.is_readable) {
      const issues = analysis.readability_issues.length > 0
        ? analysis.readability_issues.join(', ')
        : 'unclear image'

      const message = `Document ${analysis.documentId} is not readable (${issues}). ` +
        `Please re-upload a clearer photo — ensure good lighting, all edges visible, and no shadows covering text.`

      errors.push({
        documentId: analysis.documentId,
        documentType: analysis.detected_type,
        expectedType: analysis.detected_type,
        message
      })
      trace.push({
        stage: 'DocumentVerification',
        check: 'ReadabilityCheck',
        result: 'FAILED',
        detail: message
      })
    } else {
      trace.push({
        stage: 'DocumentVerification',
        check: 'ReadabilityCheck',
        result: 'PASSED',
        detail: `Document ${analysis.documentId} (${analysis.detected_type}) is readable.`
      })
    }
  }

  // ── Step 4: Cross-document patient name consistency ───────────────────────
  // Fix A: filter out null AND empty-string patient names
  const namedDocs = analyses.filter(a => a.patient_name !== null && a.patient_name.trim() !== '')

  if (namedDocs.length > 1) {
    const normalised = namedDocs.map(a => ({
      id: a.documentId,
      type: a.detected_type,
      name: a.patient_name!,
      norm: normaliseName(a.patient_name!)
    }))

    const allMatch = normalised.every(d => d.norm === normalised[0].norm)

    if (!allMatch) {
      const nameList = normalised
        .map(d => `${d.type}: "${d.name}"`)
        .join(', ')

      const message = `Patient names do not match across documents (${nameList}). ` +
        `All documents must belong to the same patient. ` +
        `If these are the same person, please re-upload documents with consistent name spelling. ` +
        `Otherwise re-upload documents for the correct patient.`

      errors.push({
        documentId: 'cross_document',
        documentType: 'MULTIPLE',
        expectedType: 'CONSISTENT_PATIENT',
        message
      })
      trace.push({
        stage: 'DocumentVerification',
        check: 'CrossDocumentConsistency',
        result: 'FAILED',
        detail: message
      })
    } else {
      trace.push({
        stage: 'DocumentVerification',
        check: 'CrossDocumentConsistency',
        result: 'PASSED',
        detail: `Patient name consistent across all documents: "${namedDocs[0].patient_name}".`
      })
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    trace
  }
}
