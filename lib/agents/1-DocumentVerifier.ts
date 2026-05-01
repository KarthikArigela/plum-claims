import { ClaimSubmission, VerificationResult } from '../types/claim.types';

export async function verifyDocuments(
  claim: ClaimSubmission
): Promise<VerificationResult> {
  // STUB — real LLM call comes in Phase 5
  return {
    passed: true,
    errors: [],
    trace: [{
      stage: 'DocumentVerification',
      check: 'DocumentTypeCheck',
      result: 'PASSED',
      detail: '[STUB] Document verification not yet implemented'
    }]
  };
}
