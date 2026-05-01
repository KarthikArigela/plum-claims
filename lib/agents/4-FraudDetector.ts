import { ClaimSubmission, FraudResult, TraceEntry } from '../types/claim.types';
import { loadPolicy } from '../policy/policyLoader';

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
      detail: `Claimed ₹${claim.claimedAmount} > threshold ₹${thresholds.high_value_claim_threshold}. Adding fraud signal.`
    });
  } else {
    trace.push({
      stage: 'FraudDetection',
      check: 'HighValueCheck',
      result: 'PASSED',
      detail: `Claimed ₹${claim.claimedAmount} within high-value threshold.`
    });
  }

  // Check 1b: Auto-manual review above limit
  if (claim.claimedAmount > thresholds.auto_manual_review_above) {
    forcedManualReview = true;
    signals.push(`AUTO_REVIEW_LIMIT: ₹${claim.claimedAmount} exceeds hard limit of ₹${thresholds.auto_manual_review_above}`);
    trace.push({
      stage: 'FraudDetection',
      check: 'AutoManualReviewCheck',
      result: 'WARNING',
      detail: `Claimed ₹${claim.claimedAmount} exceeds hard limit ₹${thresholds.auto_manual_review_above}. Forcing manual review.`
    });
  }

  // Check 2: Same-day claims count
  const sameDayClaims = claim.claimsHistory?.filter(h => h.date === claim.treatmentDate) ?? [];
  if (sameDayClaims.length >= thresholds.same_day_claims_limit) {
    forcedManualReview = true;
    signals.push(`SAME_DAY_LIMIT: ${sameDayClaims.length + 1} claims on ${claim.treatmentDate} (limit: ${thresholds.same_day_claims_limit})`);
    trace.push({
      stage: 'FraudDetection',
      check: 'SameDayClaimsCheck',
      result: 'WARNING',
      detail: `Member already has ${sameDayClaims.length} claim(s) on ${claim.treatmentDate}. Limit is ${thresholds.same_day_claims_limit}.`
    });
  } else {
    trace.push({
      stage: 'FraudDetection',
      check: 'SameDayClaimsCheck',
      result: 'PASSED',
      detail: `${sameDayClaims.length} prior claim(s) on ${claim.treatmentDate}. Within limit.`
    });
  }

  // Check 3: Monthly claims count
  const treatmentMonth = claim.treatmentDate.substring(0, 7); // "YYYY-MM"
  const monthClaims = claim.claimsHistory?.filter(h => h.date.startsWith(treatmentMonth)) ?? [];
  if (monthClaims.length >= thresholds.monthly_claims_limit) {
    forcedManualReview = true;
    signals.push(`MONTHLY_LIMIT: ${monthClaims.length + 1} claims in ${treatmentMonth} (limit: ${thresholds.monthly_claims_limit})`);
    trace.push({
      stage: 'FraudDetection',
      check: 'MonthlyClaimsCheck',
      result: 'WARNING',
      detail: `Member has ${monthClaims.length} claim(s) this month. Monthly limit is ${thresholds.monthly_claims_limit}.`
    });
  } else {
    trace.push({
      stage: 'FraudDetection',
      check: 'MonthlyClaimsCheck',
      result: 'PASSED',
      detail: `${monthClaims.length} claim(s) this month. Within limit.`
    });
  }

  const requiresManualReview = forcedManualReview;

  if (requiresManualReview) {
    trace.push({
      stage: 'FraudDetection',
      check: 'FraudRulesCheck',
      result: 'WARNING',
      detail: `Hard fraud rule breached. Forcing manual review.`
    });
  }

  // We are currently not utilizing a fractional fraud risk because all current rules are Hard Rules.
  // Set to 1.0 if manual review is required, 0.0 otherwise.
  const fraudRisk = requiresManualReview ? 1.0 : 0.0;

  return { signals, fraudRisk, requiresManualReview, trace, failed: false };
}
