import { UploadedDocument, ExtractionResult, ExtractedDocument, TraceEntry } from '../types/claim.types'
import { openai, VISION_MODEL } from '../openai'

// Medical shorthand glossary — included in all extraction prompts
const MEDICAL_SHORTHAND = `Medical abbreviation reference (expand these in your output):
HTN = Hypertension, T2DM = Type 2 Diabetes Mellitus, URI = Upper Respiratory Infection,
GERD = Gastroesophageal Reflux Disease, IBS = Irritable Bowel Syndrome,
COPD = Chronic Obstructive Pulmonary Disease, UTI = Urinary Tract Infection,
OA = Osteoarthritis, CAD = Coronary Artery Disease, CKD = Chronic Kidney Disease,
Rx = Prescription, OPD = Outpatient Department, IPD = Inpatient Department,
BMI = Body Mass Index, BP = Blood Pressure, CBC = Complete Blood Count, CBP = Complete Blood Picture,
LFT = Liver Function Test, KFT = Kidney Function Test, ECG = Electrocardiogram.
Always expand abbreviations in the diagnosis field.`

function buildVisionContent(doc: UploadedDocument) {
  if (doc.mimeType === 'application/pdf') {
    return {
      type: 'file' as const,
      file: {
        filename: doc.fileName || 'document.pdf',
        file_data: `data:application/pdf;base64,${doc.base64Data}`
      }
    }
  }
  return {
    type: 'image_url' as const,
    image_url: { url: `data:${doc.mimeType};base64,${doc.base64Data}` }
  }
}

function getExtractionPrompt(docType: string): string {
  const base = `${MEDICAL_SHORTHAND}

Return ONLY valid JSON. No explanation before or after.
For any field you cannot read, include the field name in "unreadable_fields" and set the field value to null.
Do not guess or hallucinate values — null is better than wrong data.`

  const prompts: Record<string, string> = {
    PRESCRIPTION: `${base}

Extract from this Indian medical prescription and return JSON:
{
  "patient_name": "full name as written",
  "doctor_name": "full name with qualifications",
  "doctor_registration": "registration number in any format e.g. KA/45678/2015, APMC/FMR/89145, MH/23456/2018, or bare numbers like 55926",
  "clinic_name": "clinic or hospital name",
  "date": "DD-MM-YYYY format, or null",
  "diagnosis": "primary diagnosis, expanded from abbreviations",
  "medicines": [
    { "name": "medicine name with strength", "dosage": "e.g. 1-0-1", "duration": "e.g. 5 days", "amount": 0 }
  ],
  "tests_ordered": ["list of tests if any"],
  "unreadable_fields": ["list fields you could not read"],
  "confidence": 0.0 to 1.0
}
Note: amount for medicines is 0 unless a price is listed. medicines array can be empty if none prescribed.`,

    HOSPITAL_BILL: `${base}

Extract from this Indian hospital bill, clinic invoice, OP-slip, outpatient slip, or consultation receipt and return JSON.
This includes any hospital-issued payment receipt regardless of its exact format or label:
{
  "hospital_name": "full hospital or clinic name",
  "patient_name": "full name as written",
  "doctor_name": "referring or treating doctor name",
  "bill_number": "bill or receipt number",
  "date": "DD-MM-YYYY format, or null",
  "line_items": [
    { "description": "service or item name", "quantity": 1, "amount": 0.0 }
  ],
  "subtotal": 0.0,
  "gst_amount": 0.0,
  "total_amount": 0.0,
  "payment_mode": "Cash / UPI / Card / null",
  "gstin": "GST number if present, or null",
  "unreadable_fields": ["list fields you could not read"],
  "confidence": 0.0 to 1.0
}
Note: line_items must be itemized — do not merge multiple services into one line. If amounts are crossed out and rewritten, use the final written amount.`,

    LAB_REPORT: `${base}

Extract from this Indian laboratory or diagnostic report and return JSON:
{
  "lab_name": "full laboratory name",
  "patient_name": "full name as written",
  "referring_doctor": "doctor who ordered the tests",
  "sample_date": "DD-MM-YYYY format, or null",
  "report_date": "DD-MM-YYYY format, or null",
  "tests": [
    { "name": "test name", "result": "result value as string", "unit": "unit", "normal_range": "range or null", "amount": 0.0 }
  ],
  "total_amount": 0.0,
  "pathologist_name": "signing pathologist if present",
  "nabl_accredited": true or false,
  "remarks": "any remarks or clinical correlation notes",
  "unreadable_fields": ["list fields you could not read"],
  "confidence": 0.0 to 1.0
}`,

    PHARMACY_BILL: `${base}

Extract from this Indian pharmacy or medicine bill and return JSON:
{
  "pharmacy_name": "full pharmacy name",
  "drug_license_number": "license number if visible",
  "patient_name": "full name as written",
  "doctor_name": "prescribing doctor if mentioned",
  "date": "DD-MM-YYYY format, or null",
  "medicines": [
    { "name": "medicine name with strength", "batch": "batch number", "expiry": "expiry date", "quantity": 0, "mrp": 0.0, "amount": 0.0 }
  ],
  "subtotal": 0.0,
  "discount": 0.0,
  "net_amount": 0.0,
  "unreadable_fields": ["list fields you could not read"],
  "confidence": 0.0 to 1.0
}`,

    DENTAL_REPORT: `${base}

Extract from this Indian dental report or dental clinic bill and return JSON:
{
  "clinic_name": "dental clinic name",
  "patient_name": "full name as written",
  "dentist_name": "treating dentist",
  "date": "DD-MM-YYYY format, or null",
  "procedures": [
    { "description": "procedure name", "tooth_number": "tooth number if mentioned", "amount": 0.0 }
  ],
  "total_amount": 0.0,
  "unreadable_fields": ["list fields you could not read"],
  "confidence": 0.0 to 1.0
}`,

    DISCHARGE_SUMMARY: `${base}

Extract from this Indian hospital discharge summary and return JSON:
{
  "hospital_name": "hospital name",
  "patient_name": "full name",
  "date_of_admission": "DD-MM-YYYY or null",
  "date_of_discharge": "DD-MM-YYYY or null",
  "diagnosis": "primary diagnosis, expanded",
  "treating_doctor": "doctor name",
  "procedures_done": ["list of procedures"],
  "total_amount": 0.0,
  "unreadable_fields": [],
  "confidence": 0.0 to 1.0
}`
  }

  return prompts[docType] || prompts['HOSPITAL_BILL']
}

function mapToExtractedDocument(docId: string, docType: string, raw: Record<string, unknown>): ExtractedDocument {
  // Fix B: use null check instead of || to preserve explicit zero confidence
  const confidence = Math.max(0, Math.min(1, raw.confidence != null ? (raw.confidence as number) : 0.5))
  const unreadableFields = (raw.unreadable_fields as string[]) || []

  // Unified line items — different doc types use different field names
  let lineItems: { description: string; amount: number }[] = []

  if (docType === 'PRESCRIPTION') {
    const meds = (raw.medicines as { name: string; amount?: number }[]) || []
    lineItems = meds.map(m => ({ description: m.name, amount: m.amount || 0 }))
  } else if (docType === 'HOSPITAL_BILL') {
    const items = (raw.line_items as { description: string; amount: number }[]) || []
    lineItems = items.map(i => ({ description: i.description, amount: i.amount || 0 }))
  } else if (docType === 'LAB_REPORT') {
    const tests = (raw.tests as { name: string; amount?: number }[]) || []
    lineItems = tests.map(t => ({ description: t.name, amount: t.amount || 0 }))
  } else if (docType === 'PHARMACY_BILL') {
    const meds = (raw.medicines as { name: string; amount?: number }[]) || []
    lineItems = meds.map(m => ({ description: m.name, amount: m.amount || 0 }))
  } else if (docType === 'DENTAL_REPORT') {
    const procs = (raw.procedures as { description: string; amount?: number }[]) || []
    lineItems = procs.map(p => ({ description: p.description, amount: p.amount || 0 }))
  }

  // providerName — critical for PolicyEngine network discount check
  const providerName = (
    raw.hospital_name ||
    raw.pharmacy_name ||
    raw.lab_name ||
    raw.clinic_name
    // Fix C: removed raw.dental_clinic_name — DENTAL_REPORT prompt returns clinic_name, not dental_clinic_name
  ) as string | undefined

  // date — prefer bill date, fall back to sample/report date
  const date = (
    raw.date ||
    raw.bill_date ||
    raw.sample_date ||
    raw.report_date ||
    raw.date_of_discharge
  ) as string | undefined

  // totalAmount
  const totalAmount = (
    raw.total_amount ||
    raw.net_amount ||
    raw.subtotal
  ) as number | undefined

  // diagnosis — from prescription or discharge summary
  const diagnosis = (raw.diagnosis) as string | undefined

  // doctor name
  const doctorName = (
    raw.doctor_name ||
    raw.referring_doctor ||
    raw.treating_doctor ||
    raw.dentist_name
  ) as string | undefined

  return {
    documentId: docId,
    documentType: docType,
    providerName,
    patientName: raw.patient_name as string | undefined,
    doctorName,
    doctorRegistration: raw.doctor_registration as string | undefined,
    date,
    diagnosis,
    lineItems,
    totalAmount,
    extractionConfidence: confidence,
    unreadableFields
  }
}

async function extractSingleDocument(doc: UploadedDocument): Promise<ExtractedDocument> {
  const prompt = getExtractionPrompt(doc.type)

  const response = await openai.chat.completions.create({
    model: VISION_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a medical document data extractor for Indian health insurance claims.
Extract structured data from the provided document image or PDF.
Return ONLY valid JSON matching the requested structure. No prose, no markdown.
If a field is partially visible, extract what you can and add it to unreadable_fields.
Never hallucinate values — use null for anything you cannot read with confidence.`
      },
      {
        role: 'user',
        content: [
          buildVisionContent(doc),
          { type: 'text', text: prompt }
        ]
      }
    ]
  })

  const raw = response.choices[0].message.content || '{}'
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(raw)
  } catch {
    return {
      documentId: doc.id,
      documentType: doc.type,
      extractionConfidence: 0.1,
      unreadableFields: ['all_fields']
    }
  }

  return mapToExtractedDocument(doc.id, doc.type, parsed)
}

export async function extractInformation(
  documents: UploadedDocument[],
  _claimCategory?: string
): Promise<ExtractionResult> {
  const trace: TraceEntry[] = []

  // Run all document extractions in parallel — critical for Vercel timeout
  const results = await Promise.allSettled(
    documents.map(doc => extractSingleDocument(doc))
  )

  const extracted: ExtractedDocument[] = []
  let confidenceSum = 0

  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const doc = documents[i]

    if (result.status === 'fulfilled') {
      extracted.push(result.value)
      confidenceSum += result.value.extractionConfidence

      const unreadable = result.value.unreadableFields.length > 0
        ? `Unreadable fields: ${result.value.unreadableFields.join(', ')}`
        : 'All fields readable'

      trace.push({
        stage: 'InformationExtraction',
        check: `Extract_${doc.type}`,
        result: result.value.extractionConfidence >= 0.6 ? 'PASSED' : 'WARNING',
        detail: `Extracted ${doc.type} (confidence: ${result.value.extractionConfidence.toFixed(2)}). ${unreadable}.`
      })

      // Log key extracted fields for trace visibility
      if (result.value.providerName) {
        trace.push({
          stage: 'InformationExtraction',
          check: 'ProviderExtracted',
          result: 'INFO',
          detail: `Provider: "${result.value.providerName}" (used for network discount check).`
        })
      }
      if (result.value.diagnosis) {
        trace.push({
          stage: 'InformationExtraction',
          check: 'DiagnosisExtracted',
          result: 'INFO',
          detail: `Diagnosis: "${result.value.diagnosis}".`
        })
      }
    } else {
      // Individual document failed — push fallback, pipeline continues
      const fallback: ExtractedDocument = {
        documentId: doc.id,
        documentType: doc.type,
        extractionConfidence: 0.1,
        unreadableFields: ['all_fields']
      }
      extracted.push(fallback)
      confidenceSum += 0.1

      trace.push({
        stage: 'InformationExtraction',
        check: `Extract_${doc.type}`,
        result: 'FAILED',
        detail: `Extraction failed for ${doc.type} (${doc.id}): ${result.reason}. Fallback used — confidence set to 0.1.`
      })
    }
  }

  const overallExtractionConfidence = extracted.length > 0
    ? confidenceSum / extracted.length
    : 0

  return {
    documents: extracted,
    overallExtractionConfidence,
    trace,
    failed: false
  }
}
