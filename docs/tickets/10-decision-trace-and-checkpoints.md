# 10: Persist explainable results and recovery checkpoints

**Goal:** A claim's automated outcome can be explained and recovered after interruption without duplicating completed work or decisions.

**Blocked by:** 09 — Evaluate policy and produce decisions.

**Status:** ready-for-agent

## Scope

- Connect the worker's extraction, policy evaluation, and decision stages into the sequential claim workflow.
- Persist the evidence, checks, calculations, confidence changes, and outcome associated with the claim and policy version.
- Save recovery checkpoints and make repeated execution safe while retaining meaningful retry history.

## Out of scope

- Human final decisions and review UI; these belong to later tickets.
- Exactly-once external model execution or disclosure of private model reasoning.

## Acceptance criteria

- [ ] A passed document gate can progress through the real worker stages to a persisted automated outcome, with claim and job states recorded consistently and separately from the decision.
- [ ] The ordered trace shows page results, extracted evidence, policy checks and calculations, confidence changes, and the decision summary, linked to the claim and pinned policy.
- [ ] Each completed stage has a durable checkpoint; after interruption, processing resumes from a safe point or repeats safely without duplicating decisions or trace results.
- [ ] External model calls may repeat after a crash, but their attempts remain visible. Trace details include provider and model, prompt and schema versions, available request IDs, safe errors, and source references without private model reasoning.
- [ ] An outcome and its terminal job state are persisted consistently, including when review is required.

## Verification

- Exercise a claim through the worker and inspect its decision and ordered evidence without relying on a frontend.
- Run focused tests that interrupt processing between stages or commits and verify recovery, idempotent writes, chronology, and explainability.
- Run relevant backend lint and type checks; report unrelated existing failures separately. Normal checks should not require AI credentials.

## Implementation boundaries

Keep changes focused on workflow integration, persistent results, checkpoints, and tests. Build on the earlier gate, worker, extraction, and policy slices rather than replacing them.
