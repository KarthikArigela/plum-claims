# 12a: Verify backend acceptance and evaluation

**Goal:** Establish that the backend claim lifecycle is reproducible and understandable through its APIs before frontend implementation begins.

**Blocked by:** 12 — Expose claim status, trace, and recovery APIs.

**Status:** ready-for-agent

## Scope

- Exercise the backend lifecycle with real test PostgreSQL, temporary document storage, and controlled AI responses.
- Evaluate the 12 supplied assignment cases, including expected outcomes, produced outcomes, traces, and any mismatches or evidence gaps.
- Use representative synthetic PDF and image documents to exercise actual upload and page handling; keep live AI evaluation optional and clearly distinguished.
- Document backend setup and acceptance results needed before starting the frontend.

## Out of scope

- Frontend design or implementation and final full-product delivery.
- Treating mocked model outputs as evidence of live model accuracy or silently changing assignment expectations.

## Acceptance criteria

- [ ] Backend acceptance demonstrates submission through the document gate to either an actionable stop or queued worker processing, followed by status, trace, and review where applicable.
- [ ] All 12 supplied cases have an evaluation entry showing expected and produced behavior, relevant trace, match result, and an explanation for any mismatch or unverified result.
- [ ] Synthetic PDFs and images exercise representative document types and mixed-page handling; the report identifies which checks used mocked AI and which, if any, used a live model.
- [ ] Backend setup and acceptance checks can be reproduced locally without AI credentials for ordinary tests; optional live checks use only synthetic or assignment-provided documents.
- [ ] Known failures, missing evidence, and unresolved decisions are visible. Frontend work starts only after the backend acceptance results are reviewed and accepted, not merely because a report exists.

## Verification

- Run the backend acceptance checks and case evaluation; inspect the lifecycle results and report each mismatch or unavailable live check.
- Run relevant backend lint, type, and migration checks; report unrelated existing failures separately.

## Implementation boundaries

Keep changes focused on backend acceptance tests, safe evaluation fixtures and results, and the setup information needed to reproduce them. Do not build the frontend or modify expected assignment outcomes.
