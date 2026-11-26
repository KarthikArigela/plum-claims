# 03: Persist claim submissions safely

**Goal:** A member can submit claim details and documents, receive a claim ID that survives a restart, and retry a submission without creating a duplicate.

**Blocked by:** 01 — Establish the local backend foundation; 02 — Resolve employee, patient, and policy.

**Status:** ready-for-agent

## Scope

- Accept claim details and supported documents through the backend, using the employee, patient, and policy resolved in ticket 02: Resolve employee, patient, and policy
- Validate uploads before creating a claim, then store document files locally and their verified details in PostgreSQL.
- Record the claim, its initial status, and a submission audit event before document validation begins.
- Protect submissions against duplicate retries and excessive request rates. Add the database migrations needed for this slice.

## Out of scope

- Page-level document classification, document-gate outcomes, and processing jobs; these belong to later tickets.
- Claim decisions, detailed processing traces, checkpoints, and human review.
- Frontend implementation, authentication, and cloud document storage.

## Acceptance criteria

- [ ] A valid submission returns a claim ID and `VALIDATING_DOCUMENTS` status after the claim and its documents are safely stored. The claim and files remain available after an API restart; this status does not imply the document gate has passed.
- [ ] The stored claim includes the employee, patient, category, treatment date, claimed amount, and resolved policy ID, version, and content hash. An initial submission event is recorded.
- [ ] PDF, JPEG, PNG, and WEBP files are accepted only when their contents are valid and parseable. The initial configurable limits are 10 files, 20 MB per file, 50 MB total, and 50 pages.
- [ ] Unsupported, corrupt, encrypted, unsafe, or excessive uploads receive an actionable error before a claim is created or any AI call is made.
- [ ] Stored files use generated keys rather than paths derived from uploaded filenames. Verified file type, size, hash, and page count are retained with the document metadata; document bytes are not stored in PostgreSQL.
- [ ] A claim is not reported as successfully submitted if document storage or database persistence fails. Claim and document records remain consistent, and leftover staged files can be reconciled.
- [ ] Retrying the same submission with the same idempotency key returns the existing claim. Reusing that key for different claim details or documents returns a conflict, including when requests arrive concurrently.
- [ ] Configurable, PostgreSQL-backed submission limits initially allow 5 requests per minute per IP and 3 per minute per employee. Exceeding a limit returns a clear response; an employee ID is not treated as authentication.

## Verification

- Submit valid claim details and supported files, then confirm the claim ID, initial status, stored documents, policy reference, and submission event survive a restart.
- Run focused tests for invalid files and limits, storage or database failures, duplicate and conflicting retries, concurrent submissions, and rate limits. Use real test PostgreSQL and temporary document storage where needed; do not require AI credentials.
- Run relevant backend lint and type checks; report unrelated existing failures separately.

## Implementation boundaries

Keep changes focused on claim intake, safe document storage, the database records needed for submission, and focused tests. Use the agreed backend specification for upload limits, durability, and privacy; do not implement the later document gate or decision workflow.
