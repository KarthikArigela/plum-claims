# 04: Prove page classification with the Decisions API

**Goal:** Establish whether the selected AI service can classify document pages individually and reliably associate each result with its page before the document gate depends on it.

**Blocked by:** 01 — Establish the local backend foundation.

**Status:** ready-for-agent

## Scope

- Check the official OpenAI Python SDK, configured model and account access for the Decisions API, including per-question images, supported image formats, and structured choices and confidence.
- Try a single synthetic page and a multi-page batch, asking the same document-type question separately for each page.
- Investigate errors, retry behavior, request IDs, and available rate-limit information needed for a bounded integration.
- Record findings and provide offline contract tests; live checks are optional and require explicit credentials.

## Out of scope

- Implementing the claim document gate, policy decisions, or frontend.
- Switching providers or replacing the agreed Decisions-first approach without a user decision.

## Acceptance criteria

- [ ] An opt-in live check can classify a synthetic page and a batch, with each answer unambiguously associated with its own page, or records evidence explaining why this cannot be demonstrated.
- [ ] Findings state which required inputs, response fields, image formats, model access, and account capabilities were verified and which remain unverified.
- [ ] Findings explain SDK retries and how to keep a validation cycle within three actual attempts, including relevant errors, request IDs, and rate-limit information where available.
- [ ] Offline tests cover representative response shapes and errors without network access or credentials.
- [ ] Logs and findings contain no document bytes, encoded images, secrets, or sensitive extracted values.
- [ ] If a required capability is unavailable or differs from the assumption, the result is documented and ticket 05 is paused for the user's decision; no fallback is silently selected.

## Verification

- Run focused offline contract tests; they should pass without AI credentials.
- When access is available, run the opt-in synthetic-page check and inspect the recorded findings. Report separately if the live check could not be performed.
- Run relevant backend lint and type checks; report unrelated existing failures separately.

## Implementation boundaries

Keep changes focused on a small capability check, its findings, and tests. The backend specification describes the agreed page-classification approach; do not implement the document gate in this ticket.
