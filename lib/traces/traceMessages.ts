/**
 * Centralized trace message templates
 *
 * Each template is:
 * - ONE SENTENCE ONLY (golden rule)
 * - Plum Voice: Transparent (explain why), Caring (we/you), Simple (no jargon), Elegant (professional)
 * - Data-driven: substitutes actual values (amounts, dates, names)
 * - Hardcoded: fast, deterministic, auditable
 */

// ──────────────────────────────────────────────────────────────────
// DOCUMENT VERIFIER TRACES
// ──────────────────────────────────────────────────────────────────

export const DocumentVerifierTraces = {
  // FILE UPLOAD CHECKS
  fileDataMissing: (fileIndex: number) =>
    `Upload ${fileIndex + 1} didn't come through - please try uploading again.`,

  // DOCUMENT CLASSIFICATION
  // NOTE: Omit classification-only traces (e.g., "identified as prescription")
  // - these are internal metadata, not decision-informing checks.

  classificationFailed: (fileName: string) =>
    `Couldn't identify "${fileName}" - please upload a clearer photo with good lighting.`,

  // REQUIRED DOCUMENT CHECKS
  requiredDocumentFound: (docType: string) =>
    `Found your ${docType.replace(/_/g, ' ').toLowerCase()}.`,

  requiredDocumentMissing: (docType: string) =>
    `Missing your ${docType.replace(/_/g, ' ').toLowerCase()} (required for this claim type).`,

  requiredDocumentWrong: (foundType: string, expectedType: string) =>
    `Found ${foundType.replace(/_/g, ' ').toLowerCase()} instead of ${expectedType.replace(/_/g, ' ').toLowerCase()} (not what we need for this claim).`,

  // READABILITY CHECKS
  documentUnreadable: (docType: string, issues: string[]) =>
    `${docType.replace(/_/g, ' ')} photo is too dark/blurry - please re-upload a clearer image.`,

  documentReadable: (docType: string) =>
    `${docType.replace(/_/g, ' ')} is clear and readable.`,

  // CROSS-DOCUMENT CONSISTENCY
  patientNameMismatch: (names: Map<string, string>) => {
    const namesList = Array.from(names)
      .map(([type, name]) => `${type}: "${name}"`)
      .join(', ');
    return `Patient names don't match across documents (${namesList}) - verify these are the right documents.`;
  },

  patientNameMatch: (patientName: string) =>
    `All documents are for the same patient ("${patientName}") - names match.`,
};

// ──────────────────────────────────────────────────────────────────
// POLICY ENGINE TRACES
// ──────────────────────────────────────────────────────────────────

export const PolicyEngineTraces = {
  // MEMBER CHECKS
  memberNotFound: (memberId: string) =>
    `Member ID ${memberId} not found on this policy.`,

  memberFound: (memberId: string, name: string) =>
    `Member ${memberId} (${name}) is active on this policy.`,

  // POLICY PERIOD CHECKS
  policyActive: (treatmentDate: string) =>
    `Your coverage was active on the treatment date (${treatmentDate}).`,

  policyInactive: (treatmentDate: string, endDate: string) =>
    `Your coverage ended ${endDate}; treatment date ${treatmentDate} is outside your active period.`,

  // SUBMISSION DEADLINE CHECKS
  submissionOnTime: (daysElapsed: number, deadline: number) =>
    `Claim submitted ${daysElapsed} days after treatment (deadline is ${deadline} days).`,

  submissionLate: (daysElapsed: number, deadline: number) =>
    `Claim submitted ${daysElapsed} days after treatment (deadline was ${deadline} days).`,

  // MINIMUM AMOUNT CHECKS
  amountAboveMinimum: (amount: number, minimum: number) =>
    `Claim amount ₹${amount.toLocaleString('en-IN')} meets the minimum of ₹${minimum.toLocaleString('en-IN')}.`,

  amountBelowMinimum: (amount: number, minimum: number) =>
    `Claim amount ₹${amount.toLocaleString('en-IN')} is below the minimum of ₹${minimum.toLocaleString('en-IN')}.`,

  // WAITING PERIOD CHECKS
  waitingPeriodCompleted: (periodDays: number) =>
    `You've completed the ${periodDays}-day waiting period (eligible for claims now).`,

  waitingPeriodActive: (periodDays: number, daysRemaining: number, eligibleDate: string) =>
    `Treatment is within the ${periodDays}-day waiting period (${daysRemaining} days remaining; you're eligible from ${eligibleDate}).`,

  conditionWaitingPeriodActive: (condition: string, periodDays: number, daysRemaining: number) =>
    `"${condition}" has a ${periodDays}-day waiting period (${daysRemaining} days remaining).`,

  conditionWaitingPeriodCompleted: (condition: string) =>
    `No waiting period restrictions for "${condition}".`,

  // CATEGORY COVERAGE CHECKS
  categoryNotCovered: (category: string) =>
    `${category} claims aren't covered under your plan.`,

  categoryCovered: (category: string) =>
    `${category} claims are covered under your plan.`,

  // EXCLUSIONS CHECKS
  conditionExcluded: (diagnosis: string) =>
    `"${diagnosis}" is excluded from coverage under your plan.`,

  conditionNotExcluded: () =>
    `Nothing in your claim is on the exclusions list.`,

  partialCoverageExcluded: (excludedItems: string[]) =>
    `Some items in your claim aren't covered (${excludedItems.join(', ')}); we'll approve what we can.`,

  // PRE-AUTHORIZATION CHECKS
  preAuthRequired: (category: string) =>
    `${category} claims need approval before treatment (please resubmit with pre-auth).`,

  preAuthItemRequired: (item: string, threshold: number) =>
    `"${item}" (₹${threshold.toLocaleString('en-IN')}+) needs approval before treatment.`,

  preAuthNotRequired: () =>
    `Pre-authorization isn't required for this claim.`,

  // ANNUAL OPD LIMIT CHECKS
  annualLimitAvailable: (remaining: number, total: number) =>
    `You have ₹${remaining.toLocaleString('en-IN')} remaining in your ₹${total.toLocaleString('en-IN')} annual limit.`,

  annualLimitExhausted: (used: number, total: number, resetDate: string) =>
    `You've used your annual limit of ₹${total.toLocaleString('en-IN')} (resets ${resetDate}).`,

  // CATEGORY SUB-LIMIT CHECKS
  withinCategoryLimit: (amount: number, limit: number, category: string) =>
    `Claim ₹${amount.toLocaleString('en-IN')} is within the ${category} limit of ₹${limit.toLocaleString('en-IN')}.`,

  exceedsCategoryLimit: (amount: number, limit: number, category: string) =>
    `Claim ₹${amount.toLocaleString('en-IN')} exceeds the ${category} limit (₹${limit.toLocaleString('en-IN')}); we can approve ₹${limit.toLocaleString('en-IN')}.`,

  // PER-CLAIM LIMIT CHECKS
  withinPerClaimLimit: (amount: number, limit: number) =>
    `Claim ₹${amount.toLocaleString('en-IN')} is within the per-claim limit of ₹${limit.toLocaleString('en-IN')}.`,

  exceedsPerClaimLimit: (amount: number, limit: number) =>
    `Claim ₹${amount.toLocaleString('en-IN')} exceeds the per-claim limit of ₹${limit.toLocaleString('en-IN')}; we can approve ₹${limit.toLocaleString('en-IN')}.`,

  // NETWORK DISCOUNT (INFO)
  networkStatusUnknown: (hospital: string) =>
    `Couldn't confirm if "${hospital}" is in our network (we'll proceed without discount).`,

  networkDiscountApplied: (hospital: string, percent: number) =>
    `"${hospital}" is in our network - applying ${percent}% discount.`,

  // COPAY (INFO)
  copayApplied: (percent: number, amount: number) =>
    `Your plan includes a ${percent}% co-pay (your share: ₹${amount.toLocaleString('en-IN')}).`,

  // CONSISTENCY CHECKS
  hospitalMismatch: () =>
    `Hospital name mismatch between input and documents.`,

  dateMismatch: () =>
    `Treatment date mismatch between input and documents.`,

  // FINAL AMOUNTS (INFO)
  approvalAmount: (amount: number) =>
    `Everything checks out - approved refund: ₹${amount.toLocaleString('en-IN')}.`,
};

// ──────────────────────────────────────────────────────────────────
// INFORMATION EXTRACTOR TRACES
// ──────────────────────────────────────────────────────────────────

export const InformationExtractorTraces = {
  // DATA EXTRACTION
  dataExtracted: (docType: string, confidence: number, fieldsFound?: number, fieldsExpected?: number) => {
    const details = fieldsFound && fieldsExpected ? ` (${fieldsFound}/${fieldsExpected} fields)` : '';
    return `Extracted data from ${docType}${details}.`;
  },

  extractionFailed: (docType: string) =>
    `Couldn't extract details from ${docType} (we'll continue with other documents).`,

  // PROVIDER EXTRACTION
  providerIdentified: (provider: string) =>
    `Treatment was at ${provider}.`,

  // DIAGNOSIS EXTRACTION
  diagnosisIdentified: (diagnosis: string) =>
    `Diagnosis: ${diagnosis}.`,
};

// ──────────────────────────────────────────────────────────────────
// FRAUD DETECTOR TRACES
// ──────────────────────────────────────────────────────────────────

export const FraudDetectorTraces = {
  // HIGH VALUE CHECKS
  highValueClaim: (amount: number, threshold: number) =>
    `Claim ₹${amount.toLocaleString('en-IN')} is above the high-value threshold (₹${threshold.toLocaleString('en-IN')}) - flagging for specialist review.`,

  normalValueClaim: (amount: number) =>
    `Claim amount ₹${amount.toLocaleString('en-IN')} is within normal range.`,

  // SAME-DAY CLAIMS CHECK
  multipleSameDayClaims: (count: number, date: string) =>
    `${count} claims submitted on ${date} - flagging for legitimacy check.`,

  normalSameDayActivity: (date: string) =>
    `No unusual activity on ${date}.`,

  // MONTHLY FREQUENCY CHECK
  highMonthlyFrequency: (count: number, month: string) =>
    `${count} claims in ${month} (above normal frequency) - flagging for specialist review.`,

  normalMonthlyFrequency: () =>
    `Monthly claim frequency looks normal.`,

  // FRAUD RULES CHECK
  manualReviewFlagged: (reason: string) =>
    `Flagging for specialist review (${reason}); this is a standard safety check, not a rejection.`,
};
