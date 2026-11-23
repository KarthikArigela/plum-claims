# 03: Persist idempotent claim submissions

**What to build:** A member can submit a valid claim and supported documents, receive a durable claim ID, and safely retry a timed-out submission without creating duplicates.

**Blocked by:** 01 — Establish local app foundation; 02 — Resolve employee, patient, and policy.

**Status:** ready-for-agent

- [ ] PostgreSQL migrations and repositories support claim, document metadata, job, event, decision, trace/checkpoint, and rate-limit records needed by the agreed lifecycle.
- [ ] Local document storage persists bytes behind a storage interface using generated storage keys; database stores metadata, hash, verified type, and page count.
- [ ] Upload validation checks actual format and parseability; configurable initial limits are PDF/JPEG/PNG/WEBP, 10 files, 20 MB/file, 50 MB total, and 50 pages.
- [ ] Unsupported, corrupt, encrypted, unsafe, or excessive uploads fail with actionable errors before claim creation/model calls; file paths are never derived from untrusted filenames.
- [ ] Valid submissions persist claim ID, employee/patient, category, treatment date, claimed amount, policy ID/version/hash, documents, `VALIDATING_DOCUMENTS` status, and initial audit event before the document gate.
- [ ] Claim and document metadata are transactionally consistent; a claim is not acknowledged if file persistence fails; staged-file orphans can be reconciled.
- [ ] Same idempotency key and canonical payload returns the existing claim; same key with different payload conflicts, including concurrent retries.
- [ ] PostgreSQL-backed configurable submission limits begin at 5/minute/IP and 3/minute/employee; employee ID is not treated as authentication.
- [ ] Tests cover success, pre-persistence validation errors, storage/DB failure windows, idempotency conflict/concurrency, and rate-limit behavior.
