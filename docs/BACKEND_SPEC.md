# Plum Claims — Backend Specification (Working Design)

**Status:** Agreed working design; validate and adjust during implementation/testing.  
**Scope:** Portfolio assignment implementation, designed with explicit seams for later production scaling.  
**Primary requirement source:** `problem-statement/assignment.md`, its policy/test data, and `problem-statement/sample_documents_guide.md`.

## 1. Goals

Build a reliable, explainable claims workflow that accepts PDF/image submissions, catches document problems before claim processing, extracts structured evidence, applies policy rules, and records automated and human outcomes. Accepted submissions and their uploaded files must survive process restarts. The initial deployment is local: separate frontend and backend projects, one FastAPI application, one PostgreSQL database, a separate worker process, and local-disk document storage.

The design should meet the assignment and its 12 cases before adding infrastructure for hypothetical scale. At the stated estimate, 75,000/year averages about 8.6 claims/hour; a 5× assumption is about 43/hour. This is a planning estimate, not a measured peak. Infrastructure choices are driven first by durability and recoverability, then by observed performance.

## 2. Agreed architecture

```text
Next.js frontend (React + TypeScript + shadcn/ui)
      │ REST / OpenAPI
      ▼
FastAPI application ─── PostgreSQL (claims, jobs, audit, results, rate counters)
      │                       ▲
      ├─ sync file checks     │ poll/lease and persist checkpoints/results
      ├─ sync document gate   │
      └─ enqueue jobs ────────┤
                              │
                     Separate worker process
                      ├─ VALIDATE_DOCUMENTS (operator retry only)
                      └─ PROCESS_CLAIM (sequential graph stages)

Document bytes: local filesystem behind a storage interface (future S3 adapter)
AI: OpenAI SDK — Decisions API for page classification; Responses API for
    structured extraction and conditional patient-name extraction
```

A job represents one claim-level unit of work. For `PROCESS_CLAIM`, graph stages run sequentially: extract → evaluate policy → format decision. A worker processes one claim at a time initially. Multiple worker processes may later process different jobs; database leasing prevents duplicate simultaneous ownership. Independent pages/batches may use bounded concurrency only within configured limits.

PostgreSQL is the durable source of truth and initial queue. Kafka, Redis, a cache, read replicas, microservices, and a load balancer are not initial requirements. A message broker can later notify workers, while PostgreSQL remains authoritative for jobs and claim state.

## 3. Submission and document-gate lifecycle

### 3.1 Submission sequence

1. Apply request rate limits by client IP and supplied employee ID. This project has no authentication; employee ID is an input identifier, not proof of identity.
2. Validate request fields, supported file type using file content (not filename/MIME alone), and configured resource limits. Reject malformed/unsupported/corrupt/excessive input before claim creation and before any model call; return a specific client error. Record only privacy-safe operational metrics.
3. Resolve the employee and patient, policy effective on the treatment date, patient eligibility, and applicable policy version from server-side versioned JSON. The frontend never chooses a policy. The default patient for assignment test cases is the employee when no patient is specified; dependent claims select a covered patient from backend-returned roster choices. Store resolved policy ID/version and content hash with the claim.
4. Stage uploaded files and ensure their durable final local-storage objects exist before acknowledging acceptance. Create the claim (`VALIDATING_DOCUMENTS`), document metadata, and initial audit event durably. Idempotency key is unique per submission scope. Same key + same canonical request returns the existing claim; same key + different request returns conflict. Persist claim ID before the AI gate so interrupted validation remains recoverable.
5. Run the synchronous document gate under one configurable 60-second wall-clock budget, measured after upload receipt/persistence (upload transfer time is not included). Validate/render files and classify every page. Up to 10 pages per Decisions request; same classification question per page, each image attached to a separate question so each answer maps to its page. Up to two batches per claim may be in flight, plus a configurable global provider concurrency limit. Avoid making an unbounded burst.
6. Apply deterministic backend checks to page-level results and policy document requirements. Never let the AI make policy decisions.
7. Persist page classifications, trace/audit events, and final gate status. Only a passed gate creates a `PROCESS_CLAIM` job. The claim and processing job are inserted atomically in one PostgreSQL transaction.
8. Return claim ID and current status. Frontend polls REST status/details endpoints.

### 3.2 Gate outcomes

- `VALIDATING_DOCUMENTS`: initial synchronous check is in progress.
- `PROCESSING`: gate passed and the claim workflow job is queued/running.
- `NEEDS_DOCUMENTS`: required document type(s) are clearly absent or clearly wrong. Return actionable, deterministic messages naming the detected and required types. Preserve claim and trace; do not create a processing job.
- `DOCUMENT_REVIEW_REQUIRED`: page classification/readability is uncertain or an issue needs human assessment. Preserve model evidence and uncertainty; do not create a processing job.
- `VALIDATION_RETRY_PENDING`: provider/service failure, deadline, or exhausted attempts prevented classification. This is not a document judgment. Preserve claim; do not proceed to extraction.

If one page is uncertain while a required type appears absent, uncertainty takes precedence: `DOCUMENT_REVIEW_REQUIRED`, because the uncertain page could be the missing document. A clearly absent required document with no uncertainty becomes `NEEDS_DOCUMENTS`.

Unsupported/corrupt files are request validation failures, not `NEEDS_DOCUMENTS`; no claim ID is created in that case. Validly persisted submissions that fail the semantic gate do receive a claim ID.

### 3.3 Corrections and retries

- A `NEEDS_DOCUMENTS` claim keeps its claim ID. The member may add requested documents only while the claim is awaiting documents. New documents are appended, audited, and the full current set is revalidated synchronously under the gate budget.
- Documents are immutable while processing. If extraction identifies a specific missing/unclear source document, the workflow may transition back to `NEEDS_DOCUMENTS`; uploading the correction resumes validation and processing under the same claim ID. Existing history is retained.
- On transient AI service failures, allow at most three attempts **total per page batch within one validation cycle**; retry only failed batches and retain successful batch results. Honor valid `Retry-After` within the 60-second total deadline; otherwise exponential backoff with jitter. If deadline/attempt budget expires, set `VALIDATION_RETRY_PENDING`.
- Do not silently run endless automatic validation cycles. An explicit operations action creates a `VALIDATE_DOCUMENTS` job and a new recorded cycle of up to three attempts. Only a pass creates `PROCESS_CLAIM`.
- Permanent errors (bad request/schema/config/auth/quota/billing) are not blindly retried. Preserve the claim and expose a safe operational error/status; credential/configuration errors require operator action.
- The official SDK may retry eligible errors by default. Configure SDK and application retry policy together so actual wire attempts never exceed the declared attempt budget. Track each network attempt and request ID where available.

## 4. File and AI guardrails

Initial configurable MVP defaults (provisional, not industry standards):

- Allowed: PDF, JPEG, PNG, WEBP; reject animated GIF and other unsupported formats.
- Up to 10 files, 20 MB per file, 50 MB aggregate, 50 rendered pages total.
- Inspect magic bytes / parseability and enforce limits before expensive processing. Safely render PDFs page-by-page; reject encrypted/unreadable/corrupt PDFs with actionable errors. Defend against decompression bombs, invalid dimensions, and path traversal; generate storage names rather than trusting filenames.
- PDF is rendered to page images for Decisions API because the agreed Decisions input is image-based; mixed-content PDFs are classified page-by-page. Do not assume a PDF has one type.
- Decisions categories initially: `PRESCRIPTION`, `HOSPITAL_BILL`, `LAB_REPORT`, `DIAGNOSTIC_REPORT`, `PHARMACY_BILL`, `DISCHARGE_SUMMARY`, `DENTAL_REPORT`, `OTHER`, `UNREADABLE`. Confirm categories against all policy configurations and examples. A readable page of an unrecognized type is `OTHER`; low-confidence/unreadable is routed for review.
- Store confidence/probabilities and choose a configurable acceptance threshold using labeled examples. Do not treat model confidence as calibrated truth. Record the threshold/model/prompt version used.
- Uploaded content is untrusted. Tell the model to classify visible document content only and ignore instructions printed in documents. No tools or policy authority are exposed. Validate response schema, page/question correspondence, allowed labels, confidence range, and completeness before use.
- User instructions are generated by deterministic templates/configured requirements, not free-form model text. Use a conditional Responses API structured extraction only where exact patient names are required to explain a detected mismatch. If uncertain, route to `DOCUMENT_REVIEW_REQUIRED`.
- Detailed extraction after gate uses Responses API structured output and Pydantic/schema validation. Missing values remain explicitly missing; never invent values. Source page/evidence references accompany extracted values. Policy calculation is deterministic backend logic over validated evidence.
- Only synthetic or assignment-provided sample documents are permitted for this portfolio. API credentials are environment-managed and never committed. Never put raw documents, full extracted PHI, or secrets in ordinary logs. Store minimal useful results and provenance; the original document remains the source artifact.

## 5. Data model (conceptual)

Relational tables (names illustrative):

- `claims`: UUID/public claim ID; employee roster ID; patient roster ID; category; treatment date; claimed amount/currency; workflow status; resolved policy ID/version/hash; idempotency key and canonical-request digest; created/updated timestamps; current decision pointer if present.
- `documents`: claim FK; generated storage key/path; original display filename; verified media type/size/hash; page count; upload sequence; created timestamp. Files themselves live on disk, not in PostgreSQL.
- `jobs`: claim FK; type (`VALIDATE_DOCUMENTS`, `PROCESS_CLAIM`); state (`QUEUED`, `RUNNING`, `RETRY_WAIT`, `COMPLETED`, `DEAD`); attempt/cycle counters; available-at; lease owner/expiry; last safe error code; timestamps. Index claim/status/available time. Claim one job atomically (e.g. row locking with skip-locked); use lease expiry for crash recovery.
- `claim_events` (append-only): timestamp, actor (`member`, `system`, `worker`, `operator`), event type, safe structured payload, correlation/job IDs. Meaningful lifecycle actions only; no low-level noise.
- `processing_runs` / trace records: ordered stage/page results, validated extraction JSON, policy checks and evidence, confidence adjustments, model/provider/prompt/schema versions, request IDs, retry metadata, errors. JSONB is suitable for variable extraction and policy-check details; keep query-critical identity/status/amount fields relational.
- `decisions`: automated recommendation and final human outcome are separate immutable records. Decision enum exactly `APPROVED`, `PARTIAL`, `REJECTED`, `MANUAL_REVIEW`; amount/reason/confidence where applicable; source (`AUTOMATION` or `HUMAN`); reviewer identity and rationale for human decision. Automated `MANUAL_REVIEW` is retained; human final decision does not overwrite it.
- `rate_limit_buckets`: shared PostgreSQL counters for IP and employee-key limits, expiry/window and count. Initial configurable submission limits: 5/minute/IP and 3/minute/employee. Atomic update. Employee ID is not authentication.

Policy terms/enrollment/roster are stored once in versioned JSON configuration (including company/member/dependent association). Each claim references selected policy ID/version/content hash; never duplicate full policy terms per claim. Retain historical JSON versions in source control for reproducibility. For this portfolio, enrollment edits/new companies are configuration changes, not an admin product.

## 6. Policy resolution and patient selection

- User enters/selects employee ID (authentication is out of scope). Backend endpoint returns that employee and enrolled covered dependents as displayable patient choices.
- User chooses patient by display name/relationship; frontend sends internal patient roster ID. The user need not know the ID.
- Backend verifies patient is self or enrolled eligible dependent, then resolves policy from employee/company enrollment effective on treatment date. Employee ID selects the enrollment; patient relationship/ID validates covered beneficiary. Do not select policy from patient type or client-supplied policy ID.
- Persist resolved policy ID, version, and content hash on claim. Worker loads that immutable version even after later config edits/retries.
- Assignment test cases use `member_id`; map the legacy fixture field to employee ID and default patient to employee when no patient field exists. Add dependent flow tests without changing expected semantics of existing cases.

## 7. Worker, jobs, retries, and state

- API and worker are separate processes and can share backend modules. Initial local environment runs one worker process with concurrency 1 claim/job at a time.
- PostgreSQL job table is authoritative queue. Insert claim plus `PROCESS_CLAIM` job in one transaction after gate pass. For operator validation retry, insert a `VALIDATE_DOCUMENTS` job and update status/event transactionally.
- Worker leases job, executes graph sequentially, commits durable checkpoint/result after each completed stage, heartbeats lease, and marks job complete. A crash releases work when lease expires; new worker can retry/resume from last safe checkpoint. Stage writes must be idempotent/upserted by claim/run/stage so at-least-once execution does not duplicate business results. External model calls can repeat after a crash-before-persist; record attempts and tolerate this.
- Retry transient failures up to three attempts per processing stage/job cycle, with bounded backoff; permanent failures are not retried. After exhausted automation retries, preserve the claim and transition to `MANUAL_REVIEW` / `AWAITING_HUMAN_REVIEW` with an operational trace and automated `MANUAL_REVIEW` decision as appropriate. Avoid an unlimited retry loop.
- Distinguish recoverable/skippable component degradation from failure of evidence required for a safe decision. For the assignment's `TC011`, if the simulated optional component can be skipped safely, continue to the expected `APPROVED` result with reduced confidence, an explicit degraded-component trace, and a manual-review recommendation. If a failed component makes a required policy fact unreliable, do not invent a decision; route to `MANUAL_REVIEW`. This preserves the test's explicit expected outcome while maintaining decision safety.
- Job execution state and business claim status are distinct. Example: job `RUNNING`, claim `PROCESSING`; job `COMPLETED`, claim `AWAITING_HUMAN_REVIEW`; job `RETRY_WAIT`, claim remains processing/recoverable.
- Claim status is workflow state; decision is outcome. Do not use the assignment’s decision enum as all claim statuses.

Suggested claim statuses (final names to be fixed in API schema): `VALIDATING_DOCUMENTS`, `VALIDATION_RETRY_PENDING`, `NEEDS_DOCUMENTS`, `DOCUMENT_REVIEW_REQUIRED`, `PROCESSING`, `NEEDS_MEMBER_INFORMATION`, `AWAITING_HUMAN_REVIEW`, `COMPLETED`. `COMPLETED` has an automated or human final decision; errors that require ops may use `AWAITING_HUMAN_REVIEW`.

## 8. API contract (initial REST surface)

Exact route naming may be refined with OpenAPI, while preserving these behaviors:

- `GET /health`: liveness/readiness split if useful; no secret/config leakage.
- `GET /employees/{employee_id}/covered-people`: employee and eligible dependents for selection; not a policy-choice endpoint.
- `POST /claims` (multipart): employee ID, optional patient roster ID (defaults to employee for assignment cases), category, treatment date, claimed amount, idempotency key, files. Basic failures return 4xx without claim ID. Valid persisted requests return claim ID/status even if document gate stops or needs retry.
- `GET /claims/{claim_id}`: safe claim summary/current workflow status/decision pointer.
- `GET /claims/{claim_id}/trace`: ordered audit events and explainability trace with access to document contents excluded from response by default.
- `POST /claims/{claim_id}/documents`: append requested files only in allowed correction states, rerun gate, preserve claim ID.
- `POST /claims/{claim_id}/operations/retry-validation`: explicit operator retry cycle; operator identity required in request for this unauthenticated demo and marked as unverified actor.
- `POST /claims/{claim_id}/review`: record human decision, reviewer identity, rationale; append-only decision and audit event.
- `GET /claims/{claim_id}/documents/{document_id}`: authorized/local demo file retrieval policy to be defined; never expose arbitrary paths.

Submission response is not necessarily final decision. Frontend polls claim status. Use appropriate idempotency/conflict semantics and safe error codes/messages. OpenAPI is the source for the separated Next.js client contract.

## 9. Audit, explainability, and privacy

Maintain a human-readable append-only sequence: claim submitted; policy resolved; gate outcome; requested files; processing queued; extraction/policy stage outcomes; retries/failures; decision; review requested; reviewer decision. Keep detailed page/stage outputs, confidence changes, evidence references, and errors in processing trace/job history, linked to events. Do not record every internal operation as an audit event.

Record actor, timestamp, action, claim/correlation IDs, and useful safe details. For a policy decision, trace each applicable configured rule and its outcome, values/evidence used, calculations (including line items), and confidence effects. Never rely on hidden/private model reasoning as the audit record. Avoid raw document contents and sensitive fields in ordinary logs; retain only needed structured extraction and source references under the project’s synthetic-data restriction.

## 10. Rate limits, throughput, and operational controls

- Application submission limits: configurable PostgreSQL-backed 5/minute/IP and 3/minute/employee initially. This protects demo endpoints; no authentication is implied.
- OpenAI limits are organization/project/model-specific and may be request/token/image limits. Read actual dashboard limits; inspect `Retry-After`, remaining/reset headers, 429/503 codes. Never hard-code published tier defaults as account truth.
- Use bounded semaphore for local provider concurrency, batch up to 10 page questions, at most two concurrent batches per claim. The global cap is configurable and must be conservative at startup, then tuned with metrics. In a multi-process deployment, move to a shared limiter/coordinator; process-local semaphores alone do not enforce a global cap.
- Batch page questions to reduce request overhead, not to combine classification semantics. Every page gets the same “What document is this?” question with that page’s image and its own answer.
- Disable/account for SDK automatic retries so the total three-attempt policy is accurate. Retry only transient connection/timeouts, eligible 429, 503 overload, and selected 5xx; honor provider hints and deadline. Do not retry quota/billing/auth/schema/client errors.
- Track request count, token/image usage, latency, retries, 429/503, queue depth/age, worker duration, gate duration, stage errors, and cost proxy—without sensitive document content. P90 five-minute processing target remains a proposed objective to measure, not a proven SLO; specify whether it ends at decision or review routing.
- Respect 60-second gate budget; when not met, persist `VALIDATION_RETRY_PENDING` rather than continue waiting. Configure separate per-attempt timeout and overall deadline.

## 11. Testing and acceptance

Test-first, per vertical slice: write tests for requirement/success/failure behavior before or alongside implementation; keep regressions. No need to invent every case upfront. The supplied 12 cases are baseline acceptance tests.

Add explicit tests for:

- request validation, actual file signatures, corrupt/encrypted PDFs, limits and decompression safety;
- PDF rendering, multi-page mixed document classifications, page-result mapping, batches and retry of only failed batch;
- confident mismatch, missing requirement, low confidence precedence, unreadable file vs unreadable page, provider timeout/429/503/permanent quota/schema failure, 60s deadline;
- idempotency same payload/reused key conflict, crash windows, durable claim/job transactions, worker lease expiry/duplicate workers, checkpoint restart and repeated stage writes;
- `NEEDS_DOCUMENTS` correction under same ID and full-set gate rerun; document immutability during processing; extraction gap returning for member docs vs uncertain `MANUAL_REVIEW`;
- policy resolution across companies, treatment-date effective coverage, dependent eligibility, policy version/hash pinning, assignment `member_id` compatibility;
- audit chronology, separate automated/human decision records, sensitive-data-safe logs, rate counters under concurrent requests;
- OpenAI clients mocked in tests; live model/eval tests are opt-in and use only supplied/synthetic documents.

Run all 12 assignment cases end to end and produce an eval report including outcome, expected behavior, trace, and explanation for any mismatch. Include generated synthetic documents for actual image/PDF integration tests; JSON-only fixtures do not verify the vision pipeline.

## 12. Non-goals and later evolution

Not in initial implementation: authentication/authorization, real PHI, admin enrollment editing, S3 deployment, managed Postgres/Supabase, Kafka, Redis, read replicas/cache, load balancer/autoscaling, microservices, Terraform/AWS deployment, full observability stack, production compliance certification. Keep seams for file-storage adapter, policy catalog, queue publisher/worker, model providers, and telemetry. Before real claims, perform privacy/security/legal/provider-contract review and add authentication, access control, retention/deletion, encryption/key management, backups/restore, and operational incident procedures.

At higher load: measure queue lag, AI concurrency, database contention, and gate latency. Scale stateless API instances behind a load balancer; move files to S3-compatible object storage; add worker replicas with shared global provider limiter; consider a managed queue for wakeups/decoupling, while retaining DB outbox/job truth; introduce read replicas/cache only for demonstrated read bottlenecks. Make changes based on measurements, not the generic system-design template.

## 13. Open validation points (not blockers to writing implementation tickets)

1. Confirm actual Decisions API Python SDK support/response fields and whether one request supports question-specific images as described in the current official docs; prove with a thin spike before wiring the gate.
2. Verify model access and configured account limits from the actual OpenAI project. SDK docs and API docs can evolve.
3. Test whether 10-page batch and two-batches-per-claim concurrency meet the 60s budget with realistic PDF rendering/API latency; tune the configurable limits.
4. Choose confidence threshold from labeled sample pages; do not hard-code an unvalidated threshold.
5. Define exact rule for when extracted required fields are clearly missing (ask member for specific source) versus ambiguous/unreadable (human review), based on policy/test data.
6. Fix exact claim/job enum and API error schemas in the first contract ticket. For assignment fixtures, treat supplied `policy_id` as expected test context, not a client-controlled field; resolve the policy from the employee enrollment and assert it matches the fixture.
7. Clarify target scope of P90 five-minute objective and include only after baseline measurements.
