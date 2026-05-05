import { ClaimSubmission, FraudResult, TraceEntry } from '../types/claim.types';
import { loadPolicy } from '../policy/policyLoader';
import { FraudDetectorTraces } from '../traces/traceMessages';

export async function detectFraud(claim: ClaimSubmission): Promise<FraudResult> {
  const policy = loadPolicy();
  const thresholds = policy.fraud_thresholds;
  const signals: string[] = [];
  const trace: TraceEntry[] = [];

  // Check 1: High-value claim threshold
  let forcedManualReview = false;
  
  if (claim.claimedAmount > thresholds.high_value_claim_threshold) {
    forcedManualReview = true;
    signals.push(`HIGH_VALUE_CLAIM: ₹${claim.claimedAmount} exceeds threshold of ₹${thresholds.high_value_claim_threshold}`);
    trace.push({
      stage: 'FraudDetection',
      check: 'HighValueCheck',
      result: 'WARNING',
      detail: FraudDetectorTraces.highValueClaim(claim.claimedAmount, thresholds.high_value_claim_threshold)
    });
  } else {
    trace.push({
      stage: 'FraudDetection',
      check: 'HighValueCheck',
      result: 'PASSED',
      detail: FraudDetectorTraces.normalValueClaim(claim.claimedAmount)
    });
  }

  // Check 2: Same-day claims count
  const sameDayClaims = claim.claimsHistory?.filter(h => h.date === claim.treatmentDate) ?? [];
  const totalSameDayCount = sameDayClaims.length + 1;
  if (totalSameDayCount >= thresholds.same_day_claims_limit) {
    forcedManualReview = true;
    signals.push(`SAME_DAY_LIMIT: ${totalSameDayCount} claims on ${claim.treatmentDate} (limit: ${thresholds.same_day_claims_limit})`);
    trace.push({
      stage: 'FraudDetection',
      check: 'SameDayClaimsCheck',
      result: 'WARNING',
      detail: FraudDetectorTraces.multipleSameDayClaims(totalSameDayCount, claim.treatmentDate)
    });
  } else {
    trace.push({
      stage: 'FraudDetection',
      check: 'SameDayClaimsCheck',
      result: 'PASSED',
      detail: FraudDetectorTraces.normalSameDayActivity(claim.treatmentDate)
    });
  }

  // Check 3: Monthly claims count
  const treatmentMonth = claim.treatmentDate.substring(0, 7); // "YYYY-MM"
  const monthClaims = claim.claimsHistory?.filter(h => h.date.startsWith(treatmentMonth)) ?? [];
  const totalMonthCount = monthClaims.length + 1;
  if (totalMonthCount >= thresholds.monthly_claims_limit) {
    forcedManualReview = true;
    signals.push(`MONTHLY_LIMIT: ${totalMonthCount} claims in ${treatmentMonth} (limit: ${thresholds.monthly_claims_limit})`);
    trace.push({
      stage: 'FraudDetection',
      check: 'MonthlyClaimsCheck',
      result: 'WARNING',
      detail: FraudDetectorTraces.highMonthlyFrequency(totalMonthCount, treatmentMonth)
    });
  } else {
    trace.push({
      stage: 'FraudDetection',
      check: 'MonthlyClaimsCheck',
      result: 'PASSED',
      detail: FraudDetectorTraces.normalMonthlyFrequency()
    });
  }

  const requiresManualReview = forcedManualReview;

  if (requiresManualReview) {
    trace.push({
      stage: 'FraudDetection',
      check: 'FraudRulesCheck',
      result: 'WARNING',
      detail: FraudDetectorTraces.manualReviewFlagged("fraud score or amount")
    });
  }

  // We are currently not utilizing a fractional fraud risk because all current rules are Hard Rules.
  // Set to 1.0 if manual review is required, 0.0 otherwise.
  const fraudRisk = requiresManualReview ? 1.0 : 0.0;

  return { signals, fraudRisk, requiresManualReview, trace, failed: false };
}
