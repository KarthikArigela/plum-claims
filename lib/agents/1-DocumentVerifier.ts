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
      detail: `We don't have specific document requirements on file for ${claim.claimCategory} claims. Proceeding with what you've provided.`
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
      message: `We couldn't read "${doc.fileName || doc.id}". It looks like the file didn't come through. Could you try uploading it again?`
    })
    trace.push({
      stage: 'DocumentVerification',
      check: 'FileDataCheck',
      result: 'FAILED',
      detail: `"${doc.fileName || doc.id}" arrived without any file data. We weren't able to open it.`
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
      const docLabel = result.value.detected_type.replace(/_/g, ' ').toLowerCase()
      trace.push({
        stage: 'DocumentVerification',
        check: 'DocumentClassification',
        result: 'INFO',
        detail: `We've identified "${doc.fileName || doc.id}" as a ${docLabel}.`
      })
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
        detail: `We weren't able to identify "${doc.fileName || doc.id}". Please try a sharper photo with good lighting.`
      })
    }
  }

  // ── Step 2: Required document type check ──────────────────────────────────
  const detectedTypes = analyses.map(a => a.detected_type)

  for (const required of requirements.required) {
    if (!detectedTypes.includes(required)) {
      const wrongDoc = analyses.find(a => !requirements.required.includes(a.detected_type))

      const categoryLabel = claim.claimCategory.toLowerCase().replace(/_/g, ' ')
      const requiredLabel = required.replace(/_/g, ' ').toLowerCase()
      const wrongDocLabel = wrongDoc?.detected_type.replace(/_/g, ' ').toLowerCase()
      const message = wrongDoc
        ? `We found a ${wrongDocLabel} in your upload, but a ${requiredLabel} is needed for ${categoryLabel} claims. ` +
          `Could you swap it out? You'll need: ${requirements.required.map(r => r.replace(/_/g, ' ').toLowerCase()).join(' and ')}.`
        : `We couldn't find a ${requiredLabel} in your upload. ` +
          `${categoryLabel} claims require: ${requirements.required.map(r => r.replace(/_/g, ' ').toLowerCase()).join(' and ')}.`

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
        detail: `Great. We found your ${required.replace(/_/g, ' ').toLowerCase()}.`
      })
    }
  }

  // ── Step 3: Readability check ─────────────────────────────────────────────
  for (const analysis of analyses) {
    if (!analysis.is_readable) {
      const issues = analysis.readability_issues.length > 0
        ? analysis.readability_issues.join(', ')
        : 'unclear image'

      const readableIssues = issues.replace(/_/g, ' ')
      const message = `We're having a bit of trouble reading this document (${readableIssues}). ` +
        `A clearer photo would help. Good lighting, all four edges in frame, and no shadows over the text.`

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
        detail: `Your ${analysis.detected_type.replace(/_/g, ' ').toLowerCase()} is clear and easy to read.`
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

      const message = `The names on your documents don't quite match. We found ${nameList}. ` +
        `All documents need to be for the same person.` +
        `If it's a spelling variation, please re-upload with consistent name spelling. Otherwise, check you've sent the right documents.`

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
        detail: `All documents are for the same patient - "${namedDocs[0].patient_name}". Looks good.`
      })
    }
  }

  return {
    passed: errors.length === 0,
    errors,
    trace
  }
}
