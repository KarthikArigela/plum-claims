import { UploadedDocument, ExtractionResult } from '../types/claim.types';

export async function extractInformation(
  documents: UploadedDocument[]
): Promise<ExtractionResult> {
  // STUB — real LLM call comes in Phase 5
  return {
    documents: documents.map(doc => ({
      documentId: doc.id,
      documentType: doc.type as any, // casting for stub
      patientName: '[STUB]',
      extractionConfidence: 0.5,
      unreadableFields: []
    })),
    overallExtractionConfidence: 0.5,
    trace: [{
      stage: 'InformationExtraction',
      check: 'DocumentParsing',
      result: 'INFO',
      detail: '[STUB] Extraction not yet implemented — using metadata fallback'
    }],
    failed: false
  };
}
