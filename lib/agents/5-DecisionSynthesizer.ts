import { PolicyCheckResult, FraudResult, TraceEntry, ClaimDecisionOutput } from '../types/claim.types';

export function synthesizeDecision(
  claimId: string,
  policyResult: PolicyCheckResult,
  fraudResult: FraudResult,
  systemConfidence: number,
  allTrace: TraceEntry[],
  degradedComponents: string[]
): ClaimDecisionOutput {
  
  let finalDecision = policyResult.decision;

  // Fraud override: if hard signals present OR fuzzy risk is high, escalate to MANUAL_REVIEW
  if ((fraudResult.requiresManualReview || fraudResult.fraudRisk >= 0.80) && finalDecision === 'APPROVED') {
    finalDecision = 'MANUAL_REVIEW';
  }

  // Confidence floor: if systemConfidence < 0.50, always MANUAL_REVIEW
  if (systemConfidence < 0.50) {
    finalDecision = 'MANUAL_REVIEW';
  }

  return {
    claimId,
    decision: finalDecision,
    approvedAmount: policyResult.approvedAmount,
    rejectionReasons: policyResult.rejectionReasons,
    systemConfidence: Math.max(0, Math.min(1, systemConfidence)),
    trace: allTrace,
    degradedComponents,
    calculationBreakdown: undefined // Could build this from trace if needed
  };
}
