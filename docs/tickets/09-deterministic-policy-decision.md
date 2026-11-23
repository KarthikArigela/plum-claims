# 09: Evaluate policy and produce decisions

**What to build:** The system evaluates extracted evidence against the claim’s pinned policy version and returns the assignment’s decision with amount, reason, confidence, and rule-level evidence.

**Blocked by:** 08 — Extract structured claim evidence.

**Status:** ready-for-agent

- [ ] Policy rules are loaded from the selected versioned configuration; decision calculations are deterministic and not authored by the model.
- [ ] Evaluation covers applicable member/policy validity, submission dates, waiting periods, pre-authorization, exclusions, fraud/manual-review triggers, limits, network discount, copay, and line-item treatment.
- [ ] Decision is exactly one of `APPROVED`, `PARTIAL`, `REJECTED`, or `MANUAL_REVIEW`, with approved amount when applicable, clear reason, and confidence score.
- [ ] Rule precedence and policy ambiguities are resolved from documented configuration/assignment expectations; applicable checks and calculations remain explainable.
- [ ] Missing evidence that has a clearly identifiable required replacement requests that document; ambiguity/unreadability routes to `MANUAL_REVIEW`.
- [ ] Degraded optional component behavior never compromises a required policy fact; preserve the supplied TC011 expected behavior only when safe and make degraded confidence/review recommendation explicit.
- [ ] Tests cover all supplied decision cases, exact money arithmetic, rule precedence, waiting eligibility date, exclusions, and unsupported/missing evidence.
