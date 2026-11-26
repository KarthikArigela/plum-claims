# 12: Expose claim status, trace, and recovery APIs

**Goal:** Members and operations users can follow a claim, understand its next action and history, and use allowed recovery and review actions through documented backend APIs.

**Blocked by:** 06 — Recover interrupted validation and correct documents; 07 — Run durable jobs in a separate worker; 10 — Persist explainable results and recovery checkpoints; 11 — Record human review and audit history.

**Status:** ready-for-agent

## Scope

- Complete the claim summary, status, decision, document, event, and trace read APIs and document their contracts.
- Ensure correction, validation retry, and human-review actions from earlier tickets are consistently exposed and enforce their allowed states.
- Provide safe polling responses for later member and operations interfaces.

## Out of scope

- Frontend implementation and real authentication or production authorization.
- Rebuilding recovery or review behavior already delivered by earlier tickets.

## Acceptance criteria

- [ ] Documented API responses show current claim status, decision availability, relevant job status, and actionable next steps without confusing those concepts.
- [ ] Claim history and trace show meaningful events and evidence while omitting raw document bytes, filesystem paths, secrets, and unnecessary sensitive content.
- [ ] Document access resolves only document IDs belonging to the requested claim and cannot access arbitrary paths. The local-demo access policy is explicitly documented and does not imply authentication.
- [ ] Correction and validation-retry actions enforce the allowed claim states and retain the same claim and history; invalid requests return clear errors.
- [ ] Human review retains separate automated and human decision records, and the API rejects disallowed review actions.
- [ ] The operations API can list claims by workflow status and retrieve the details needed for review.
- [ ] OpenAPI describes the available endpoints, inputs, responses, and errors consistently with observed behavior.

## Verification

- Exercise claim polling, trace, document access, correction, retry, review, and status-filtered listing through the API without a frontend.
- Run focused integration tests for status changes, errors, document ownership, privacy, and disallowed transitions.
- Run relevant backend lint and type checks; report unrelated existing failures separately. Normal checks should not require AI credentials.

## Implementation boundaries

Keep changes focused on the remaining API surface, contract consistency, and tests. Reuse the recovery and review behavior delivered earlier rather than implementing it again.
