import { ClaimSubmission, VerificationResult, TraceEntry, UploadedDocument } from '../types/claim.types'
import { loadPolicy } from '../policy/policyLoader'
import { openai, VISION_MODEL } from '../openai'
import { DocumentVerifierTraces } from '../traces/traceMessages'

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
- If it is a hospital invoice, receipt, bill, OP-slip, or consultation receipt with a fee/total amount, detected_type is HOSPITAL_BILL (even if it's from a dental or vision clinic)
- If it is a diagnostic report (lab results, X-ray report, dental procedure summary) WITHOUT pricing/fee information, detected_type is the specific report type (e.g., DENTAL_REPORT, LAB_REPORT)
- If the document contains any currency symbols (₹), "Amount", "Total", or "Invoice No.", it is likely a HOSPITAL_BILL.
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

const DOC_SYNONYMS: Record<string, string[]> = {
  'LAB_REPORT': ['LAB_REPORT', 'DIAGNOSTIC_REPORT'],
  'DIAGNOSTIC_REPORT': ['DIAGNOSTIC_REPORT', 'LAB_REPORT'],
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
  docsWithoutData.forEach((doc, idx) => {
    errors.push({
      documentId: doc.id,
      documentType: 'UNKNOWN',
      expectedType: doc.type,
      message: `We couldn't read "${doc.fileName || doc.id}". It looks like the file didn't come through. Could you try uploading it again?`
    })
    trace.push({
      stage: 'DocumentVerification',
      check: 'FileDataCheck',
      result: 'FAILED',
      detail: DocumentVerifierTraces.fileDataMissing(idx)
    })
  })

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
    } else {
      // LLM failed for this doc — treat as unverifiable
      errors.push({
        documentId: doc.id,
        documentType: 'UNKNOWN',
        expectedType: doc.type,
        message: `We're having trouble reading "${doc.fileName || doc.id}". Could you re-upload a clearer copy?`
      })
      trace.push({
        stage: 'DocumentVerification',
        check: 'DocumentClassification',
        result: 'FAILED',
        detail: DocumentVerifierTraces.classificationFailed(doc.fileName || doc.id)
      })
    }
  }

  // ── Step 2: Required document type check ──────────────────────────────────
  const detectedTypes = analyses.map(a => a.detected_type)

  for (const required of requirements.required) {
    const synonyms = DOC_SYNONYMS[required] || [required]
    const hasRequired = analyses.some(a => synonyms.includes(a.detected_type))

    if (!hasRequired) {
      const requiredLabel = required.replace(/_/g, ' ').toLowerCase()
      const foundTypes = analyses.map(a => a.detected_type.replace(/_/g, ' ').toLowerCase())
      const message = foundTypes.length > 0
        ? DocumentVerifierTraces.requiredDocumentWrong(foundTypes.join(', '), required)
        : DocumentVerifierTraces.requiredDocumentMissing(required)

      errors.push({
        documentId: analyses[0]?.documentId || 'missing',
        documentType: analyses[0]?.detected_type || 'MISSING',
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
        detail: DocumentVerifierTraces.requiredDocumentFound(required)
      })
    }
  }

  // ── Step 3: Readability check ─────────────────────────────────────────────
  for (const analysis of analyses) {
    if (!analysis.is_readable) {
      const message = DocumentVerifierTraces.documentUnreadable(analysis.detected_type, analysis.readability_issues)
      errors.push({
        documentId: analysis.documentId,
        documentType: analysis.detected_type,
        expectedType: analysis.declared,
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
        detail: DocumentVerifierTraces.documentReadable(analysis.detected_type)
      })
    }
  }

  // ── Step 4: Cross-document patient name consistency ───────────────────────
  // filter out null AND empty-string patient names
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
      const namesMap = new Map(normalised.map(d => [d.type, d.name]))
      const message = DocumentVerifierTraces.patientNameMismatch(namesMap)

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
        detail: DocumentVerifierTraces.patientNameMatch(namedDocs[0].patient_name!)
      })
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    trace
  }
}
