import { 
  ClaimSubmission, 
  ExtractionResult, 
  PolicyCheckResult, 
  TraceEntry, 
  ClaimDecision,
} from '../types/claim.types';
import { PolicyTerms, PolicyMember } from '../policy/policyLoader';

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
      addCheck('MEMBER_NOT_FOUND', false, `Member ${claim.memberId} not found in policy.`);
      return { checks, approvedAmount, decision, rejectionReasons, trace };
    } else {
      addCheck('Member Exists', true, `Member ${member.name} found.`);
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
      addCheck('Policy Active', true, `Treatment date is within policy period.`);
    } else {
      addCheck('POLICY_INACTIVE', false, `Treatment date ${claim.treatmentDate} is outside active policy period.`);
    }

    // 3. Submission within 30-day deadline
    const daysSinceTreatment = diffDays(submissionDate, treatmentDate);
    if (daysSinceTreatment <= policy.submission_rules.deadline_days_from_treatment) {
      addCheck('Submission Deadline', true, `Submitted within ${policy.submission_rules.deadline_days_from_treatment} days.`);
    } else {
      addCheck('SUBMISSION_LATE', false, `Submission is ${daysSinceTreatment} days late.`);
    }

    // 4. Minimum claim amount (₹500)
    if (claim.claimedAmount >= policy.submission_rules.minimum_claim_amount) {
      addCheck('Minimum Amount', true, `Claimed amount ₹${claim.claimedAmount} meets minimum ₹${policy.submission_rules.minimum_claim_amount}.`);
    } else {
      addCheck('MINIMUM_AMOUNT_NOT_MET', false, `Claimed amount ₹${claim.claimedAmount} is below minimum ₹${policy.submission_rules.minimum_claim_amount}.`);
    }

    // 5. Initial 30-day waiting period from join date
    const daysSinceJoin = diffDays(treatmentDate, joinDate);
    if (daysSinceJoin >= policy.waiting_periods.initial_waiting_period_days) {
      addCheck('Initial Waiting Period', true, `Member joined ${daysSinceJoin} days ago, passes initial 30 days.`);
    } else {
      addCheck('WAITING_PERIOD', false, `Treatment within initial ${policy.waiting_periods.initial_waiting_period_days} days of joining.`);
    }

    // 6. Condition-specific waiting period
    let specificWaitingFailed = false;
    for (const diagnosis of allDiagnoses) {
      const lowerDiag = diagnosis.toLowerCase();
      for (const [condition, waitDays] of Object.entries(policy.waiting_periods.specific_conditions)) {
        if (lowerDiag.includes(condition.replace('_', ' '))) {
          if (daysSinceJoin < waitDays) {
            specificWaitingFailed = true;
            const eligibleDate = new Date(joinDate.getTime() + waitDays * 24 * 3600 * 1000).toISOString().split('T')[0];
            addCheck('WAITING_PERIOD', false, `Condition ${condition} requires ${waitDays} days waiting period. Eligible after ${eligibleDate}.`);
          }
        }
      }
    }
    if (!specificWaitingFailed) {
      addCheck('Condition Waiting Period', true, `No specific waiting period violations found.`);
    }

    // 7. Category is covered
    const categoryKey = claim.claimCategory.toLowerCase();
    const catRules = policy.opd_categories[categoryKey];
    if (catRules && catRules.covered) {
      addCheck('Category Covered', true, `Category ${claim.claimCategory} is covered.`);
    } else {
      addCheck('CATEGORY_NOT_COVERED', false, `Category ${claim.claimCategory} is not covered.`);
    }

    // 8. Diagnosis/treatment exclusions
    let hasExclusions = false;
    for (const diagnosis of allDiagnoses) {
      for (const excl of policy.exclusions.conditions) {
        if (this.isExclusionMatch(diagnosis, excl)) {
          hasExclusions = true;
          addCheck('EXCLUDED_CONDITION', false, `Diagnosis matches excluded condition: ${excl}`);
        }
      }
    }
    
    // Check line items for exclusions
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
      addCheck('Exclusions (Partial)', true, `Found excluded line items, processing as partial approval.`, false);
      if (decision === 'APPROVED') decision = 'PARTIAL';
    } else if (!hasExclusions) {
      addCheck('Diagnosis Exclusions', true, `No exclusions found.`);
    }

    // 9. Pre-authorization required and obtained
    let preAuthMissing = false;
    if (catRules?.requires_pre_auth) {
      if (!claim.preAuthObtained) {
        preAuthMissing = true;
        addCheck('PRE_AUTH_MISSING', false, `Pre-authorization required for ${claim.claimCategory} but not obtained.`);
      }
    }
    
    // Check item-level pre-auth
    if (catRules?.high_value_tests_requiring_pre_auth && catRules.high_value_tests_requiring_pre_auth.length > 0) {
      const threshold = catRules.pre_auth_threshold || Infinity;
      for (const item of allItems) {
        if (item.amount > threshold && this.lowerDiagMatch(item.description, catRules.high_value_tests_requiring_pre_auth)) {
          if (!claim.preAuthObtained) {
            preAuthMissing = true;
            addCheck('PRE_AUTH_MISSING', false, `Pre-authorization required for ${item.description} (> ₹${threshold}) but not obtained. Please resubmit with pre-auth.`);
          }
        }
      }
    }
    if (!preAuthMissing) {
      addCheck('Pre-authorization', true, `Pre-authorization requirements met or not applicable.`);
    }

    // 10. Annual OPD limit (₹50,000)
    const ytd = claim.ytdClaimsAmount || 0;
    const remainingAnnual = policy.coverage.annual_opd_limit - ytd;
    if (remainingAnnual > 0) {
      addCheck('Annual OPD Limit', true, `Remaining annual limit: ₹${remainingAnnual}.`);
    } else {
      addCheck('ANNUAL_LIMIT_EXCEEDED', false, `Annual OPD limit exceeded.`);
    }

    // 11. Category sub-limit check
    const catLimit = catRules?.sub_limit || Infinity;
    if (claim.claimedAmount <= catLimit) {
      addCheck('Category Sub-limit', true, `Claimed amount within category sub-limit.`);
    } else {
      addCheck('Category Sub-limit', false, `Claimed amount exceeds category sub-limit of ₹${catLimit}.`, false);
      // We emit a WARNING trace instead of FAILED for non-critical
      trace[trace.length - 1].result = 'WARNING';
    }

    // 12. Per-claim limit (₹5,000)
    if (claim.claimedAmount <= policy.coverage.per_claim_limit) {
      addCheck('Per-claim Limit', true, `Claimed amount within per-claim limit (₹${policy.coverage.per_claim_limit}).`);
    } else {
      addCheck('PER_CLAIM_EXCEEDED', false, `Claimed amount ₹${claim.claimedAmount} exceeds the per-claim limit of ₹${policy.coverage.per_claim_limit}.`);
    }

    // 13. Financial Calculation
    if (rejectionReasons.length > 0) {
      return { checks, approvedAmount: 0, decision: 'REJECTED', rejectionReasons, trace, partialApprovalDetails };
    }

    let calculatedAmount = claim.claimedAmount;
    
    if (decision === 'PARTIAL') {
      const rejectedAmount = partialApprovalDetails.rejected.reduce((sum, ri) => {
        const item = allItems.find(i => i.description === ri.item);
        return sum + (item?.amount || 0);
      }, 0);
      calculatedAmount -= rejectedAmount;
      partialApprovalDetails.approved = allItems.filter(i => !partialApprovalDetails.rejected.find(r => r.item === i.description)).map(i => i.description);
    }

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
            rejectionReasons.push('UNVERIFIABLE_PROVIDER_NETWORK_STATUS');
            trace.push({ 
              stage: 'FINANCIAL', 
              check: 'Network Discount', 
              result: 'FAILED', 
              detail: `Provider name missing for item: "${itemDesc}". Cannot safely determine network discount eligibility. Flagging for manual review.` 
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
        // If there are no line items extracted, we cannot safely apply discounts.
        // Or if we want to fallback to overarching claim hospital name when no documents have line items?
        // To be absolutely safe, let's just use the overarching claim hospital name here 
        // ONLY if there are literally zero line items extracted (e.g. simple single-doc claims without itemization).
        const isNetwork = policy.network_hospitals.some(h => h.toLowerCase() === claim.hospitalName?.toLowerCase());
        if (isNetwork) {
           networkDiscount = (calculatedAmount * catRules.network_discount_percent) / 100;
        }
      }
      
      if (networkDiscount > 0) {
        calculatedAmount -= networkDiscount;
        trace.push({ stage: 'FINANCIAL', check: 'Network Discount', result: 'INFO', detail: `Applied ${catRules.network_discount_percent}% network discount: -₹${networkDiscount}` });
      }
    }

    let copay = 0;
    if (catRules?.copay_percent) {
      copay = (calculatedAmount * catRules.copay_percent) / 100;
      calculatedAmount -= copay;
      trace.push({ stage: 'FINANCIAL', check: 'Copay', result: 'INFO', detail: `Applied ${catRules.copay_percent}% co-pay: -₹${copay}` });
    }

    approvedAmount = Math.min(calculatedAmount, policy.coverage.per_claim_limit, remainingAnnual);

    trace.push({ stage: 'FINANCIAL', check: 'Final Approval', result: 'INFO', detail: `Calculated amount: ₹${approvedAmount}` });

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
