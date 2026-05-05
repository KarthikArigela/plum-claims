// Map verbose technical rejection reasons to simple, user-friendly messages
export function simplifyRejectionReasons(reasons: string[]): string[] {
  const mappings: Array<{ pattern: RegExp; simplified: string }> = [
    // Document verification issues (Stricter patterns to avoid "Found X instead of Y" confusion)
    { pattern: /missing.*prescription|need.*prescription|provide.*prescription/i, simplified: 'We need a prescription to process this claim.' },
    { pattern: /missing.*hospital.bill|need.*hospital.bill|provide.*hospital.bill|required.*hospital.bill/i, simplified: 'We need a hospital bill or itemized receipt.' },
    { pattern: /missing.*lab.report|need.*lab.report|provide.*lab.report/i, simplified: 'We need your lab test report.' },
    { pattern: /missing.*discharge.summary|need.*discharge.summary|provide.*discharge.summary/i, simplified: 'We need your discharge summary.' },
    { pattern: /missing.*pharmacy.bill|need.*pharmacy.bill|provide.*pharmacy.bill/i, simplified: 'We need a pharmacy receipt or medicine bill.' },
    { pattern: /unreadable|unclear|dark|blurry|shadowed|low-contrast/i, simplified: 'The document was too unclear to read. Please upload a clearer photo.' },
    { pattern: /name.*mismatch|names.*don't.*match|names.*don.*t.*match|spelling.*variation/i, simplified: 'The names on your documents don\'t match. Please verify your documents are for the same person.' },

    // Policy and timing issues
    { pattern: /waiting.period|within.*waiting.*period/i, simplified: 'This treatment falls within the waiting period of your policy.' },
    { pattern: /not covered|isn.*t covered|aren.*t covered|category.*isn.*t|claim.*category.*not/i, simplified: 'This claim category isn\'t covered under your plan.' },
    { pattern: /pre.auth|pre-auth|pre.*authorisation|pre.*authorization/i, simplified: 'This claim requires pre-authorization. Please resubmit with approval.' },
    { pattern: /annual.*limit|limit.*exceeded|used.*up.*year/i, simplified: 'You\'ve used your annual coverage limit.' },
    { pattern: /submission.*deadline|days.*after.*treatment|claimed.*more.*than.*days/i, simplified: 'This claim was submitted too long after treatment. Claims must be submitted within 30 days.' },
    { pattern: /outside.*active.*period|inactive|falls.*outside.*policy|period/i, simplified: 'Treatment date is outside your active policy period.' },

    // Member and policy issues
    { pattern: /member.*not.*found|couldn.*t find.*member|member.*doesn.*t exist/i, simplified: 'We couldn\'t find this member on the policy. Please verify your member ID.' },
    { pattern: /excluded.*condition|matches.*excluded|condition.*not.*covered/i, simplified: 'This medical condition is excluded from your policy coverage.' },
  ]

  return reasons.map(reason => {
    for (const { pattern, simplified } of mappings) {
      if (pattern.test(reason)) {
        return simplified
      }
    }
    // Fallback: return original if no mapping found
    return reason
  })
}
