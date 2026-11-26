# 11: Record human review and audit history

**Goal:** An operations reviewer can understand the automated recommendation and record a separate, attributable final decision without losing the claim's history.

**Blocked by:** 10 — Persist explainable results and recovery checkpoints.

**Status:** ready-for-agent

## Scope

- Provide the backend review data and action needed to inspect a recommendation and record a human decision.
- Maintain a meaningful chronological claim timeline and preserve detailed retries in the processing history.
- Clearly identify reviewer identity as unverified in this unauthenticated demo.

## Out of scope

- Operations UI, real authentication or production authorization, and changes to automated policy calculations.
- Completing the broader claim read and recovery API surface, which is covered by ticket 12.

## Acceptance criteria

- [ ] Review data includes the automated result, relevant evidence and trace, member actions, retries, and meaningful events in chronological order.
- [ ] A reviewer can record identity, final decision, applicable approved amount, rationale, and timestamp for an allowed review state.
- [ ] The human decision is a separate immutable record and does not overwrite the automated recommendation, including an automated `MANUAL_REVIEW` result.
- [ ] Meaningful review actions are added to an append-only timeline; detailed execution retries remain in processing history rather than flooding the timeline.
- [ ] Reviewer identity is explicitly marked unverified, and invalid or disallowed review actions are rejected without changing the existing decision.

## Verification

- Exercise an allowed review and inspect the separate automated and human decisions and event history without a frontend.
- Run focused tests for audit ordering, rationale and identity, distinct decision records, and disallowed state transitions.
- Run relevant backend lint and type checks; report unrelated existing failures separately. Normal checks should not require AI credentials.

## Implementation boundaries

Keep changes focused on review behavior, decision records, meaningful audit events, and tests. Reuse the existing claim trace and worker results; leave UI work to later tickets.
