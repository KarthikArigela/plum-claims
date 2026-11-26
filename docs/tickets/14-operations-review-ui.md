# 14: Build operations review UI

**Goal:** An operations user can find a claim, understand what happened, recover eligible validation failures, and record a separate human outcome.

**Blocked by:** 12a — Verify backend acceptance and evaluation; 13 — Build member submission and tracking UI.

**Status:** ready-for-agent

## Scope

- Review the previous claim-detail experience as a reference and improve the operations flow using the finished backend APIs.
- Show claim status, automated results, evidence, history, and a separate human decision.
- Support allowed validation retries and human review actions.

## Out of scope

- Real authentication or production authorization, changes to policy decisions, and copying the previous prototype's backend.
- Reusing legacy assets without confirming their licensing.

## Acceptance criteria

- [ ] The operations view lists claims by workflow status and opens a claim's detail and review view.
- [ ] Claim workflow status, job execution status, automated recommendation, and human final decision are clearly distinguished.
- [ ] A reviewer can inspect a readable timeline and trace with source-page references, policy checks, confidence changes, retries, and safe failure messages.
- [ ] An operator can request a new validation cycle only when allowed and can see its progress or outcome.
- [ ] A reviewer can submit an allowed final decision with identity, rationale, and approved amount when applicable; the original automated recommendation remains visible.
- [ ] The interface marks reviewer identity as unverified and does not expose raw model payloads, secrets, or local filesystem paths.
- [ ] The main review, retry, and status flows are responsive and accessible.

## Verification

- Review the previous claim-detail screen and agree on useful improvements before implementing the operations view.
- Exercise claim discovery, trace inspection, validation retry, and human review against the backend.
- Run focused frontend tests and relevant lint, type, and build checks; report unrelated existing failures separately.

## Implementation boundaries

Keep changes focused on the operations interface and its existing backend contracts. Do not add production identity guarantees or replace the backend decision and audit logic.
