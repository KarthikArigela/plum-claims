# 09: Evaluate policy and produce decisions

**Goal:** Evaluate claim evidence against the correct policy and produce an explainable, consistent recommendation without allowing AI to decide policy outcomes.

**Blocked by:** 08 — Extract structured claim evidence.

**Status:** ready-for-agent

## Scope

- Apply the claim's pinned policy version to validated evidence using deterministic backend rules and accurate money calculations.
- Produce the required decision, reason, amount, confidence, and rule-level evidence.
- Handle missing or uncertain evidence and degraded components without inventing facts.

## Out of scope

- Full durable trace and checkpoint integration, human final decisions, and frontend implementation.
- Changing policy terms or letting the model choose coverage outcomes.

## Acceptance criteria

- [ ] Applicable policy checks cover member and policy validity, submission dates, waiting periods, pre-authorization, exclusions, fraud or review triggers, limits, network discounts, copays, and line items.
- [ ] A decision is one of `APPROVED`, `PARTIAL`, `REJECTED`, or `MANUAL_REVIEW`, with a clear reason, confidence score, and approved amount when applicable.
- [ ] Each result identifies the relevant checks, evidence, and calculations; rule precedence follows the documented policy and assignment expectations.
- [ ] When a specific replacement document is clearly needed, the claim requests it; ambiguous or unreadable required evidence routes to manual review rather than a guessed outcome.
- [ ] A safely skippable optional failure may preserve the expected TC011 approval with reduced confidence, an explicit degradation trace, and a review recommendation. A failure affecting a required policy fact routes to manual review.
- [ ] Policy versions, calculation results, and decision behavior are consistent for the same inputs; policy terms are not hardcoded or authored by the model.

## Verification

- Exercise representative approval, partial approval, rejection, and manual-review cases using the supplied policy and assignment cases.
- Run focused tests for money arithmetic, rule precedence, waiting periods, exclusions, missing evidence, and degraded behavior. Record any unresolved assignment ambiguity rather than silently deciding it.
- Run relevant backend lint and type checks; report unrelated existing failures separately. Normal checks should not require AI credentials.

## Implementation boundaries

Keep changes focused on deterministic policy evaluation, decision results, and tests. Use the pinned policy and assignment expectations; durable cross-stage recovery and human review belong to later tickets.
