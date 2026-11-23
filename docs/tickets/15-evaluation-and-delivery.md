# 15: Complete evaluation and delivery documentation

**What to build:** A reviewer can reproduce the application locally and inspect evidence that the assignment’s required scenarios work, including all 12 supplied evaluation cases.

**Blocked by:** 05 — Gate claims on page-level document validation; 09 — Evaluate policy and produce decisions; 10 — Persist explainable results and recovery checkpoints; 13 — Build member submission and tracking UI; 14 — Build operations review UI.

**Status:** ready-for-agent

- [ ] All 12 assignment cases are run through the system/evaluation harness with produced outcome, expected behavior, full trace, match result, and mismatch explanation.
- [ ] Generated synthetic PDFs/images cover representative document types, mixed pages, and quality variations from the sample guide; live model evaluation is opt-in.
- [ ] Architecture document, component contracts, local setup, limitations, and measured scale-up path reflect what is actually implemented.
- [ ] Clean-checkout local instructions start PostgreSQL, backend, worker, and frontend; Docker Compose provides reproducible local dependencies.
- [ ] CI runs backend tests/lint/type checks, frontend tests/lint/type/build, and migration checks without external AI credentials.
- [ ] Privacy and security caveats clearly state synthetic/assignment-only data, no real authentication, and no production compliance claim.
- [ ] Repository contains no secrets or real member health information; evaluation artifacts are safe to commit.
