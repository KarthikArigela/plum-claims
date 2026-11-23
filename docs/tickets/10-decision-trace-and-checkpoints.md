# 10: Persist explainable results and recovery checkpoints

**What to build:** Every completed workflow stage leaves durable, retry-safe evidence, and a reviewer can understand how the automated outcome followed from extracted facts and policy rules.

**Blocked by:** 09 — Evaluate policy and produce decisions.

**Status:** ready-for-agent

- [ ] Persist ordered graph-stage results, page results, extraction evidence, policy checks/calculations, confidence changes, and decision summary linked to claim and policy version.
- [ ] Save a durable checkpoint after each completed stage; retries resume from the last safe checkpoint or safely repeat idempotent writes.
- [ ] Automated decisions and trace records are not duplicated by at-least-once worker execution; external model retries remain visible.
- [ ] Trace includes provider/model, prompt/schema versions, request IDs when available, attempts, safe errors, and source references, but no private model reasoning.
- [ ] Claim outcome and terminal job state are persisted consistently; claim status remains separate from decision and job status.
- [ ] Tests inject failures between stages/commits and verify recoverability, idempotent persistence, chronology, and explainability.
