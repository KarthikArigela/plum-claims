import {
  ClaimSubmission,
  ExtractionResult,
  PolicyCheckResult,
  TraceEntry,
  ClaimDecision,
} from '../types/claim.types';
import { PolicyTerms, PolicyMember } from '../policy/policyLoader';
import { PolicyEngineTraces } from '../traces/traceMessages';

export class PolicyEngine {
  public evaluate(
    claim: ClaimSubmission,
    extraction: ExtractionResult,
    policy: PolicyTerms,
    currentDate?: string
  ): PolicyCheckResult {
    const trace: TraceEntry[] = [];
    const rejectionReasons: string[] = [];
    const partialApprovalDetails = { approved: [] as string[], rejected: [] as {item: string, reason: string}[] };
    let approvedAmount = 0;
    let decision: ClaimDecision = 'APPROVED';
    const checks: { name: string; passed: boolean; reason: string }[] = [];

    const addCheck = (name: string, passed: boolean, reason: string, isCritical = true) => {
      checks.push({ name, passed, reason });
      trace.push({
        stage: 'POLICY_ENGINE',
        check: name,
        result: passed ? 'PASSED' : 'FAILED',
        detail: reason
      });
      if (!passed && isCritical) {
        // Only add if not already present
        if (!rejectionReasons.includes(reason)) {
            rejectionReasons.push(reason);
        }
        decision = 'REJECTED';
      }
    };

    const parseDate = (d: string) => new Date(d);
    const diffDays = (d1: Date, d2: Date) => Math.floor((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));

    const treatmentDate = parseDate(claim.treatmentDate);
    const submissionDateStr = claim.submissionDate || currentDate || new Date().toISOString(); 
    const submissionDate = parseDate(submissionDateStr);

    const allDiagnoses = extraction.documents.map(d => d.diagnosis).filter(Boolean) as string[];
    const allItems = extraction.documents.flatMap(d => (d.lineItems || []).map(li => ({ ...li, providerName: d.providerName })));

    // 1. Member exists in policy roster
    let member = policy.members.find(m => m.member_id === claim.memberId);
    let primaryMember: PolicyMember | undefined;

    if (!member) {
      addCheck('MEMBER_NOT_FOUND', false, PolicyEngineTraces.memberNotFound(claim.memberId));
      return { checks, approvedAmount, decision, rejectionReasons, trace };
    } else {
      addCheck('Member Exists', true, PolicyEngineTraces.memberFound(claim.memberId, member.name));
      if (member.relationship !== 'SELF') {
        primaryMember = policy.members.find(m => m.member_id === member?.primary_member_id);
      } else {
        primaryMember = member;
      }
    }

    const joinDate = parseDate(primaryMember?.join_date || member.join_date || policy.policy_holder.policy_start_date);

    // 2. Policy is active on treatment date
    const pStart = parseDate(policy.policy_holder.policy_start_date);
    const pEnd = parseDate(policy.policy_holder.policy_end_date);
    if (treatmentDate >= pStart && treatmentDate <= pEnd) {
      addCheck('Policy Active', true, PolicyEngineTraces.policyActive(claim.treatmentDate));
    } else {
      addCheck('POLICY_INACTIVE', false, PolicyEngineTraces.policyInactive(claim.treatmentDate, policy.policy_holder.policy_end_date));
    }

    // 3. Submission within 30-day deadline
    const daysSinceTreatment = diffDays(submissionDate, treatmentDate);
    if (daysSinceTreatment <= policy.submission_rules.deadline_days_from_treatment) {
      addCheck('Submission Deadline', true, PolicyEngineTraces.submissionOnTime(daysSinceTreatment, policy.submission_rules.deadline_days_from_treatment));
    } else {
      addCheck('SUBMISSION_LATE', false, PolicyEngineTraces.submissionLate(daysSinceTreatment, policy.submission_rules.deadline_days_from_treatment));
    }

    // 4. Minimum claim amount (₹500)
    if (claim.claimedAmount >= policy.submission_rules.minimum_claim_amount) {
      addCheck('Minimum Amount', true, PolicyEngineTraces.amountAboveMinimum(claim.claimedAmount, policy.submission_rules.minimum_claim_amount));
    } else {
      addCheck('MINIMUM_AMOUNT_NOT_MET', false, PolicyEngineTraces.amountBelowMinimum(claim.claimedAmount, policy.submission_rules.minimum_claim_amount));
    }

    // 5. Initial 30-day waiting period from join date
    const daysSinceJoin = diffDays(treatmentDate, joinDate);
    if (daysSinceJoin >= policy.waiting_periods.initial_waiting_period_days) {
      addCheck('Initial Waiting Period', true, PolicyEngineTraces.waitingPeriodCompleted(policy.waiting_periods.initial_waiting_period_days));
    } else {
      const remaining = policy.waiting_periods.initial_waiting_period_days - daysSinceJoin;
      const eligibleDate = new Date(joinDate.getTime() + policy.waiting_periods.initial_waiting_period_days * 24 * 3600 * 1000).toISOString().split('T')[0];
      addCheck('WAITING_PERIOD', false, PolicyEngineTraces.waitingPeriodActive(policy.waiting_periods.initial_waiting_period_days, remaining, eligibleDate));
    }

    // 6. Condition-specific waiting period
    let specificWaitingFailed = false;
    for (const diagnosis of allDiagnoses) {
      const lowerDiag = diagnosis.toLowerCase();
      for (const [condition, waitDays] of Object.entries(policy.waiting_periods.specific_conditions)) {
        if (lowerDiag.includes(condition.replace('_', ' '))) {
          if (daysSinceJoin < waitDays) {
            specificWaitingFailed = true;
            const remaining = waitDays - daysSinceJoin;
            addCheck('WAITING_PERIOD', false, PolicyEngineTraces.conditionWaitingPeriodActive(condition.replace(/_/g, ' '), waitDays, remaining));
          }
        }
      }
    }
    if (!specificWaitingFailed) {
      addCheck('Condition Waiting Period', true, PolicyEngineTraces.conditionWaitingPeriodCompleted('diagnoses'));
    }

    // 7. Category coverage check (The "bucket" e.g. Pharmacy, Dental, Vision)
    const categoryKey = claim.claimCategory.toLowerCase();
    const catRules = policy.opd_categories[categoryKey];
    const catDisplayName = claim.claimCategory.toLowerCase().replace(/_/g, ' ')
    if (catRules && catRules.covered) {
      addCheck('Category Covered', true, PolicyEngineTraces.categoryCovered(catDisplayName));
    } else {
      addCheck('CATEGORY_NOT_COVERED', false, PolicyEngineTraces.categoryNotCovered(catDisplayName));
    }

    // 8. Diagnosis/treatment exclusions (The specific "condition" e.g. Maternity, Cosmetic)
    // Even if a category (like Consultation) is covered, a specific condition might be excluded.
    let hasExclusions = false;
    for (const diagnosis of allDiagnoses) {
      for (const excl of policy.exclusions.conditions) {
        if (this.isExclusionMatch(diagnosis, excl)) {
          hasExclusions = true;
          addCheck('EXCLUDED_CONDITION', false, PolicyEngineTraces.conditionExcluded(diagnosis));
        }
      }
    }


    // 9. User Input vs Extracted Document fuzzy Consistency Checks for Health Provider & Treatment Date
    if (claim.hospitalName && extraction.documents.length > 0) {
      const userHospital = claim.hospitalName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const hasHospitalMatch = extraction.documents.some((d: any) => {
        if (!d.providerName) return false;
        const extracted = d.providerName.toLowerCase().replace(/[^a-z0-9]/g, '');
        return extracted.includes(userHospital) || userHospital.includes(extracted);
      });

      if (!hasHospitalMatch) {
        addCheck('Provider Consistency', false, PolicyEngineTraces.hospitalMismatch(), false);
        trace[trace.length - 1].result = 'WARNING';
      }
    }

    if (claim.treatmentDate && extraction.documents.length > 0) {
      const uDate = parseDate(claim.treatmentDate);
      const hasDateMatch = extraction.documents.some((d: any) => {
        if (!d.date) return false;
        const eDate = parseDate(d.date);
        const diff = Math.abs(diffDays(uDate, eDate));
        return diff <= 7; // Allow 1 week tolerance
      });

      if (!hasDateMatch) {
        addCheck('Date Consistency', false, PolicyEngineTraces.dateMismatch(), false);
        trace[trace.length - 1].result = 'WARNING';
      }
    }

    // 10. Partial line item Exclusions (Audit line-by-line)
    const categorySpecificExclusions = (policy.exclusions as any)[`${categoryKey}_exclusions`] || [];
    const ruleExclusions = catRules?.excluded_procedures || catRules?.excluded_items || [];
    const allCategoryExclusions = [...categorySpecificExclusions, ...ruleExclusions];

    for (const item of allItems) {
      for (const excl of allCategoryExclusions) {
        if (this.isExclusionMatch(item.description, excl)) {
          partialApprovalDetails.rejected.push({ item: item.description, reason: `Exclusion: ${excl}` });
        }
      }
    }
    
    if (partialApprovalDetails.rejected.length > 0) {
      addCheck('Exclusions (Partial)', true, PolicyEngineTraces.partialCoverageExcluded(partialApprovalDetails.rejected.map(r => r.item)), false);
      if (decision === 'APPROVED') decision = 'PARTIAL';
    } else if (!hasExclusions) {
      addCheck('Diagnosis Exclusions', true, PolicyEngineTraces.conditionNotExcluded());
    }

    // 11. Overall Pre-authorization required and obtained
    let preAuthMissing = false;
    if (catRules?.requires_pre_auth) {
      if (!claim.preAuthObtained) {
        preAuthMissing = true;
        addCheck('PRE_AUTH_MISSING', false, PolicyEngineTraces.preAuthRequired(catDisplayName));
      }
    }

    // 12. Check line-item-level Pre-authorization required
    if (catRules?.high_value_tests_requiring_pre_auth && catRules.high_value_tests_requiring_pre_auth.length > 0) {
      const threshold = catRules.pre_auth_threshold || Infinity;
      for (const item of allItems) {
        if (item.amount > threshold && this.lowerDiagMatch(item.description, catRules.high_value_tests_requiring_pre_auth)) {
          if (!claim.preAuthObtained) {
            preAuthMissing = true;
            addCheck('PRE_AUTH_MISSING', false, PolicyEngineTraces.preAuthItemRequired(item.description, threshold));
          }
        }
      }
    }
    if (!preAuthMissing) {
      addCheck('Pre-authorization', true, PolicyEngineTraces.preAuthNotRequired());
    }

    // 13. Annual OPD limit check
    const ytd = claim.ytdClaimsAmount || 0;
    const remainingAnnual = policy.coverage.annual_opd_limit - ytd;
    if (remainingAnnual > 0) {
      addCheck('Annual OPD Limit', true, PolicyEngineTraces.annualLimitAvailable(remainingAnnual, policy.coverage.annual_opd_limit));
    } else {
      const resetDate = policy.policy_holder.policy_end_date; // Assuming reset on renewal
      addCheck('ANNUAL_LIMIT_EXCEEDED', false, PolicyEngineTraces.annualLimitExhausted(ytd, policy.coverage.annual_opd_limit, resetDate));
    }

    // 14. Category sub-limit check
    const catLimit = catRules?.sub_limit || Infinity;
    if (claim.claimedAmount <= catLimit) {
      addCheck('Category Sub-limit', true, PolicyEngineTraces.withinCategoryLimit(claim.claimedAmount, catLimit, catDisplayName));
    } else {
      addCheck('Category Sub-limit', false, PolicyEngineTraces.exceedsCategoryLimit(claim.claimedAmount, catLimit, catDisplayName), false);
      // We emit a WARNING trace instead of FAILED for non-critical
      trace[trace.length - 1].result = 'WARNING';
    }

    // 15. Per-claim limit check
    if (claim.claimedAmount <= policy.coverage.per_claim_limit) {
      addCheck('Per-claim Limit', true, PolicyEngineTraces.withinPerClaimLimit(claim.claimedAmount, policy.coverage.per_claim_limit));
    } else {
      addCheck('PER_CLAIM_EXCEEDED', false, PolicyEngineTraces.exceedsPerClaimLimit(claim.claimedAmount, policy.coverage.per_claim_limit));
    }

    // 16. Claim Financial Calculation
    if (rejectionReasons.length > 0) {
      return { checks, approvedAmount: 0, decision: 'REJECTED', rejectionReasons, trace, partialApprovalDetails };
    }

    let calculatedAmount = claim.claimedAmount;
    
    // --- Step A: Deduct Partial Exclusions ---
    if (decision === 'PARTIAL') {
      const rejectedAmount = partialApprovalDetails.rejected.reduce((sum, ri) => {
        const item = allItems.find(i => i.description === ri.item);
        return sum + (item?.amount || 0);
      }, 0);
      calculatedAmount -= rejectedAmount;
      partialApprovalDetails.approved = allItems.filter(i => !partialApprovalDetails.rejected.find(r => r.item === i.description)).map(i => i.description);
    }

    // --- Step B: Network Hospital Discount ---
    let networkDiscount = 0;
    if (catRules?.network_discount_percent) {
      if (allItems.length > 0) {
        let networkEligibleAmount = 0;
        const approvedItems = decision === 'PARTIAL' ? partialApprovalDetails.approved : allItems.map(i => i.description);
        
        for (const itemDesc of approvedItems) {
          const originalItem = allItems.find(i => i.description === itemDesc);
          const provider = originalItem?.providerName;
          
          if (!provider) {
            // Cannot safely determine network status. Abort and flag for manual review.
            decision = 'MANUAL_REVIEW';
            rejectionReasons.push("We couldn't confirm the hospital network for one of your items. A specialist will review this for you.");
            trace.push({
              stage: 'FINANCIAL',
              check: 'Network Discount',
              result: 'FAILED',
              detail: PolicyEngineTraces.networkStatusUnknown(itemDesc)
            });
            return { checks, approvedAmount: 0, decision, rejectionReasons, trace, partialApprovalDetails };
          }
          
          const isNetwork = policy.network_hospitals.some(h => h.toLowerCase() === provider.toLowerCase());
          if (isNetwork) {
             networkEligibleAmount += originalItem?.amount || 0;
          }
        }
        
        networkEligibleAmount = Math.min(networkEligibleAmount, calculatedAmount);

        if (networkEligibleAmount > 0) {
          networkDiscount = (networkEligibleAmount * catRules.network_discount_percent) / 100;
        }
      } else {
        // Fallback to overarching claim hospital name for simple claims
        const isNetwork = policy.network_hospitals.some(h => h.toLowerCase() === claim.hospitalName?.toLowerCase());
        if (isNetwork) {
           networkDiscount = (calculatedAmount * catRules.network_discount_percent) / 100;
        }
      }
      
      if (networkDiscount > 0) {
        calculatedAmount -= networkDiscount;
        trace.push({ stage: 'FINANCIAL', check: 'Network Discount', result: 'INFO', detail: PolicyEngineTraces.networkDiscountApplied(claim.hospitalName || 'your hospital', catRules.network_discount_percent) });
      }
    }

    // --- Step C: Co-pay Application ---
    let copay = 0;
    if (catRules?.copay_percent) {
      copay = (calculatedAmount * catRules.copay_percent) / 100;
      calculatedAmount -= copay;
      trace.push({ stage: 'FINANCIAL', check: 'Copay', result: 'INFO', detail: PolicyEngineTraces.copayApplied(catRules.copay_percent, copay) });
    }

    // --- Step D: Final Caps (Annual & Per-Claim) ---
    approvedAmount = Math.min(calculatedAmount, policy.coverage.per_claim_limit, remainingAnnual);

    trace.push({ stage: 'FINANCIAL', check: 'Final Approval', result: 'INFO', detail: PolicyEngineTraces.approvalAmount(approvedAmount) });

    return { checks, approvedAmount, decision, rejectionReasons, trace, partialApprovalDetails };
  }

  private lowerDiagMatch(description: string, tests: string[]) {
    const lowerDesc = description.toLowerCase();
    return tests.some(t => lowerDesc.includes(t.toLowerCase()));
  }

  // ── Exclusion Matching ─────────────────────────────────────────────
  //
  // Exclusion phrases are read directly from policy_terms.json and
  // tokenized at match time. No developer synonyms, no hardcoded keyword
  // maps — everything derives from the policy file.
  //
  // Known limitation: semantic paraphrasing (e.g. "nose job" for "cosmetic
  // rhinoplasty") will not match. A production system would use
  // embedding-based similarity for this.

  // Words too generic to carry exclusion-specific meaning on their own
  private static readonly EXCLUSION_STOP_WORDS = new Set([
    'and', 'or', 'of', 'the', 'in', 'for', 'a', 'an', 'to', 'non',
    'surgery', 'treatment', 'program', 'programs', 'procedure',
    'procedures', 'therapy', 'services', 'related', 'necessary',
    'health', 'medical', 'clinical',
  ]);

  /**
   * Check if text matches an exclusion phrase from the policy.
   *
   * Tokenizes the exclusion phrase into significant words (dropping generic
   * stop words), then checks if ANY significant word appears in the text.
   * Short words (≤5 chars) use word-boundary regex to prevent substring
   * false positives (e.g. "war" inside "warfarin").
   *
   * Used for both diagnosis-level and line-item exclusion checks.
   */
  private isExclusionMatch(text: string, exclusion: string): boolean {
    const lowerText = text.toLowerCase();

    // Tokenize the exclusion phrase from the policy JSON
    const significantWords = exclusion
      .toLowerCase()
      .replace(/[()]/g, '')
      .split(/[\s\-]+/)
      .filter(w => w.length > 3 && !PolicyEngine.EXCLUSION_STOP_WORDS.has(w));

    if (significantWords.length === 0) return false;

    // Any single significant concept word is enough for a match
    return significantWords.some(word => {
      if (word.length <= 5) {
        // Word-boundary check for short words to prevent substring false positives
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`\\b${escaped}\\b`, 'i').test(lowerText);
      }
      return lowerText.includes(word);
    });
  }
}
