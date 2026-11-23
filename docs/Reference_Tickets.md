# Plum Claims — Ordered Implementation Tickets

Tickets are intentionally vertical and ordered by dependency. Each ticket should get its own branch and small, reviewable commits. Add tests before/alongside implementation. The detailed working design is in [`BACKEND_SPEC.md`](BACKEND_SPEC.md).

## Epic 0 — Requirements and baseline

### PC-01 — Turn assignment cases into acceptance tests
**Goal:** Establish executable baseline behavior before changing the implementation.

**Scope**
- Inspect all 12 cases in `problem-statement/test_cases.json` and policy/document data.
- Define test fixtures and expected outputs without changing the source requirements.
- Keep legacy `member_id` fixtures compatible as employee identity; default patient to employee when no patient ID is supplied. Treat the fixture `policy_id` as an assertion/context field, not as a client-selected policy.
- Identify synthetic PDF/image fixtures needed where JSON fixtures cannot exercise actual file/vision processing.

**Acceptance criteria**
- Each case has a test or an explicitly documented evaluation test.
- Tests distinguish workflow status from decision and verify traces for expected stops/decisions.
- Baseline gaps/ambiguous assignment expectations are recorded, not silently reinterpreted.

### PC-02 — Define domain states and API contracts
**Goal:** Lock names and legal transitions before persistence/API implementation.

**Scope**
- Define Pydantic schemas/enums for claim status, decision, job type/state, document type, gate result, audit actor/event, and structured errors.
- Define legal claim transitions and status-versus-decision semantics.
- Specify idempotency behavior and multipart submission fields.
- Generate OpenAPI as backend/frontend contract.

**Acceptance criteria**
- Decision enum exactly `APPROVED`, `PARTIAL`, `REJECTED`, `MANUAL_REVIEW`.
- Workflow statuses include gate/retry/member-doc/review/processing/completed states and are not mixed with decisions.
- Schemas reject invalid enum values and malformed payloads.
- Contracts document response codes and whether an ID exists for each class of error.

## Epic 1 — Local foundation and policy catalog

### PC-03 — Create separated frontend/backend project foundations
**Goal:** Establish reproducible local developer setup without adding cloud infrastructure.

**Scope**
- Backend Python package using FastAPI, Pydantic, asyncio, OpenAI SDK, LangGraph where appropriate.
- Separate `frontend/` Next.js React TypeScript app with shadcn/ui.
- Local PostgreSQL service in Docker Compose; one command/documented steps to start dependencies.
- Environment-based config and safe example env file; secrets excluded from Git.
- Health endpoint and CORS for local frontend.

**Acceptance criteria**
- Backend and frontend run independently and communicate over REST.
- Local PostgreSQL starts reproducibly; credentials are not checked in.
- Basic health checks work; no model key needed for health/tests.

### PC-04 — Load and resolve versioned policy configuration
**Goal:** Resolve member/company policy and covered people from JSON, with no policy logic hardcoded.

**Scope**
- Parse/validate policy JSON and expose a policy catalog interface.
- Resolve employee enrollment and eligible self/dependent patient using treatment date.
- Select policy by employee/company association; reject client-supplied policy selection.
- Compute and retain policy content hash/version.
- Return covered-person choices for frontend; support assignment `member_id` compatibility.

**Acceptance criteria**
- Supplied policy data loads with schema validation.
- Multiple policy/company fixture resolves to correct employee policy.
- Ineligible patient and inactive enrollment are rejected deterministically.
- Historical policy version can be loaded by ID/version/hash.

## Epic 2 — Database, files, and durable intake

### PC-05 — Add PostgreSQL persistence and migrations
**Goal:** Create core relational state for claims and operational recovery.

**Scope**
- SQLAlchemy async or chosen async PostgreSQL data layer and migrations.
- Tables: claims, documents metadata, jobs, claim events, decisions, processing traces/runs, rate buckets.
- Useful indexes, constraints, foreign keys, JSONB for variable extraction/check results.
- Separate workflow status and decision records.

**Acceptance criteria**
- Migrations create schema on an empty local DB.
- Constraints enforce unique idempotency scope and valid references.
- Claim references policy version/hash, not duplicated full terms.
- Automated and human decision records are separate and append-only.

### PC-06 — Implement local document storage and safe upload validation
**Goal:** Safely persist supported documents before acknowledging valid submissions.

**Scope**
- Storage interface and local filesystem adapter (future S3 seam).
- Supported PDF/JPEG/PNG/WEBP; verify signatures/parseability, not just client MIME.
- Configurable defaults: 10 files, 20 MB/file, 50 MB aggregate, 50 pages.
- Safe PDF page count/render pipeline; generated paths; checks for corrupt/encrypted files, oversized dimensions/decompression bombs/path traversal.
- Temp/staging cleanup/reconciliation and file hashes.

**Acceptance criteria**
- Valid files persist and metadata refers to generated storage key.
- Invalid/corrupt/unsupported/excessive file request fails before claim creation/model call with actionable error.
- Storage failure never returns accepted claim; orphan cleanup is tested.
- Files excluded from source control and served only through controlled IDs.

### PC-07 — Implement idempotent claim intake and eligibility API
**Goal:** Persist claim ID and validated submission context before the synchronous AI gate.

**Scope**
- `GET /employees/{employee_id}/covered-people`.
- `POST /claims` multipart request: employee ID, optional patient ID (default employee), claim category, treatment date, amount, idempotency key, files.
- Resolve/pin policy and stage files; persist claim with `VALIDATING_DOCUMENTS`, document metadata, and audit event.
- Same key+same canonical payload returns existing claim; same key+different payload conflicts.
- Rate limits in PostgreSQL: configurable 5/min/IP and 3/min/employee.

**Acceptance criteria**
- Accepted/persisted submission returns stable claim ID before gate call.
- Policy/dependent eligibility checked before model calls.
- Claim + document metadata are transactionally consistent; claim is not accepted if file persistence failed.
- Idempotency concurrent retry creates one claim only.
- Invalid request/files do not create claim ID; limit response is deterministic and privacy-safe.

## Epic 3 — Document gate and AI integration

### PC-08 — Spike Decisions API SDK and batch semantics
**Goal:** Prove exact provider/API capabilities before integrating a critical gate.

**Scope**
- Verify installed official Python SDK supports `client.decisions.create` for `gpt-6-luna`, typed choice/confidence/probabilities, per-question image instructions, and required image formats.
- Create minimal live spike behind explicit opt-in environment flag, plus mocked contract tests.
- Confirm request IDs, error classes, headers, and SDK retry behavior; determine configuration to ensure maximum three actual attempts.

**Acceptance criteria**
- A synthetic image can be classified into an allowed label in opt-in test.
- Multiple page images map to separate same-question answers in one request.
- No secrets or image contents logged.
- If capability differs from docs/account access, stop and present evidence before choosing Responses-only gate; preserve agreed architecture until user decides.

### PC-09 — Build PDF renderer and page-level classification contracts
**Goal:** Normalize uploads into page images and deterministic typed page-result records.

**Scope**
- Render each PDF page; image uploads count as one page; preserve document ID/page number/source hash.
- Define AI adapter interface, Decisions request builder, structured result validation, prompt/version metadata.
- Categories: prescription, hospital bill, lab report, diagnostic report, pharmacy bill, discharge summary, dental report, other, unreadable; ensure policy category coverage.

**Acceptance criteria**
- Mixed PDF/image submissions yield one result per page with stable mapping.
- Response rejects missing/duplicate/unknown question names, labels, malformed confidence or incomplete pages.
- Prompt explicitly treats visible content as untrusted and asks only “What document is this?” per page; no tools/policy authority.
- Unit tests run without network using mocked client.

### PC-10 — Implement gate rules, messages, and confidence routing
**Goal:** Convert page classifications into precise, actionable gate outcomes.

**Scope**
- Read required/optional document types from selected policy JSON.
- Deterministic set-level coverage checks and templates name observed wrong/missing and required types.
- Configurable confidence threshold; choose initial value only after labeled sample evaluation.
- Uncertainty precedence over apparent missing type; add `DOCUMENT_REVIEW_REQUIRED`.
- Conditional Responses structured extraction of patient names only when needed to explain a detected cross-document mismatch; uncertainty routes review.
- Persist page results/trace and status. Only pass inserts `PROCESS_CLAIM` job in same DB transaction as status update.

**Acceptance criteria**
- Wrong/missing required docs -> `NEEDS_DOCUMENTS`, specific message, claim ID retained, no process job.
- Any uncertain page -> `DOCUMENT_REVIEW_REQUIRED` even if required type appears missing.
- Provider failure/deadline -> `VALIDATION_RETRY_PENDING`, not a document judgment.
- Name mismatch gives specific names when confidently extracted; otherwise human review.
- Passing gate atomically queues one processing job.

### PC-11 — Add bounded AI throughput, retries, and 60s gate deadline
**Goal:** Use provider limits efficiently without bursts or hidden retry multiplication.

**Scope**
- Up to 10 page questions per Decisions request; up to two in-flight batches per claim.
- Configurable global concurrency cap; local semaphore first, shared coordinator seam for future multi-process deployment.
- Overall 60s gate deadline including rendering, provider calls, retry waits, and final checks (upload transfer excluded).
- Three total attempts per failed batch per validation cycle; successful batches retained; retry only failed batches.
- SDK automatic retry policy aligned/disabled as appropriate; honor `Retry-After`; exponential backoff+jitter fallback; classify retryable vs permanent errors.
- Capture safe rate headers/latency/request ID and usage metadata where available.

**Acceptance criteria**
- Tests prove actual network-attempt budget, no nested retries, and bounded wall-clock behavior.
- 429/eligible 503 transient failures honor retry hints/backoff; quota/billing/auth/client/schema errors do not retry.
- Deadline exhaustion persists `VALIDATION_RETRY_PENDING`; no claim goes to extraction without gate pass.
- Per-batch successful output remains and only failed batch repeats.
- Concurrency limits are configurable and tested across async calls.

### PC-12 — Add correction uploads and operator validation retries
**Goal:** Recover claims awaiting documents or failed validation without losing history.

**Scope**
- Add documents to `NEEDS_DOCUMENTS` only; append docs and audit; rerun full-set gate.
- Freeze document set during processing; allow extraction to request specific additional/clearer evidence and return to `NEEDS_DOCUMENTS` where justified.
- Operator endpoint queues `VALIDATE_DOCUMENTS` job for a new cycle (three attempts), records operator actor (unverified in demo).
- Validation job pass creates processing job; no direct processing on gate failure.

**Acceptance criteria**
- Same claim ID retained for correction/retry.
- No upload mutation while active processing; state transition is atomic.
- Retry cycles and actors are auditable; no automatic endless retry.
- Validation and processing jobs cannot both race claim transitions incorrectly.

## Epic 4 — Durable worker and decision workflow

### PC-13 — Implement PostgreSQL job leasing and worker process
**Goal:** Run durable asynchronous work independently of API process.

**Scope**
- Worker CLI/process polls PostgreSQL, leases/claims job atomically, heartbeat/lease expiry, attempt counters, backoff.
- Initial worker concurrency 1; multiple processes later claim distinct jobs.
- Handle both `VALIDATE_DOCUMENTS` and `PROCESS_CLAIM` job types.
- Worker shutdown/cancellation and restart recovery.

**Acceptance criteria**
- API and worker run separately.
- Competing workers cannot own one job at once.
- Expired lease is recoverable after crash.
- Job and claim statuses remain distinct; job insert and claim transition transactional.

### PC-14 — Implement structured document extraction graph stage
**Goal:** Extract assignment fields after gate pass with provenance and graceful degradation.

**Scope**
- LangGraph or explicit graph orchestration for sequential stages; extraction uses OpenAI Responses API and strict Pydantic/JSON schema.
- Extract patient, diagnosis/treatment, bill amounts/dates, doctor details, line items as applicable.
- Record per-field missing/unreadable/confidence/source page. Never fabricate.
- Retry transient failures (three attempts per stage/job cycle); preserve checkpoint; provider/schema permanent/exhausted failure -> manual review.

**Acceptance criteria**
- Structured output validates; invalid/missing required values are represented explicitly.
- Source page references link extracted values to stored document/page.
- Model failures don’t crash worker or erase prior gate/claim data.
- Only gate-passed claims can enter extraction.

### PC-15 — Implement deterministic policy evaluation
**Goal:** Apply configured policy rules and produce an explainable recommendation.

**Scope**
- Evaluate eligibility, dates/waiting periods, coverage/exclusions, sublimits, copays, network/preauth, line items, limits, fraud thresholds as policy requires.
- Deterministic calculations from validated extraction; no model-generated monetary decision.
- Explicit missing-evidence path: request member evidence when exact missing item is known; ambiguity/illegible/contradictory evidence -> `MANUAL_REVIEW`.
- Produce per-rule evidence/check result and confidence adjustments.
- For `TC011`, distinguish the explicitly simulated skippable component failure from failure of decision-critical evidence: preserve the expected approved outcome only when safe, lower confidence, surface degraded processing, and recommend human review; otherwise route to `MANUAL_REVIEW` rather than guess.

**Acceptance criteria**
- Unit tests cover every policy rule and supplied expected outcomes.
- Trace explains each pass/fail, calculation, and rule source/version.
- No unsupported data silently treated as zero/false.
- Existing 12 case expectations handled or mismatches documented with rationale.

### PC-16 — Format and persist decision, trace, and checkpoints
**Goal:** Save a complete explainable outcome safely under at-least-once worker execution.

**Scope**
- Format `APPROVED`, `PARTIAL`, `REJECTED`, or `MANUAL_REVIEW`, approved amount/reason/confidence.
- Save ordered trace and stage checkpoints after each completed node.
- Idempotent upserts/unique run-stage keys to avoid duplicate business outputs on retry.
- Automated manual-review recommendation remains immutable; final human decision separate.

**Acceptance criteria**
- Worker crash after any checkpoint resumes/retries without losing claim or duplicating decisions.
- External model call may repeat but attempts are traceable.
- Terminal business outcome and job completion update transactionally.
- Trace is understandable without model hidden reasoning.

### PC-17 — Implement human review and append-only audit timeline
**Goal:** Enable operations review and preserve who did what, when, and why.

**Scope**
- Human decision endpoint with actor ID, final decision, amount, rationale.
- Append-only audit events for lifecycle milestones; detailed node retries remain in job/processing trace.
- Return ordered timeline and associated evidence/trace to operations API.

**Acceptance criteria**
- Human decision does not overwrite automated recommendation.
- Reviewer actor/rationale/time persisted; timeline ordering stable.
- Non-ops paths cannot submit review decision (demo auth limitations explicitly marked).

## Epic 5 — Read APIs, UI, security, and delivery

### PC-18 — Add claim status, result, trace, and safe document retrieval APIs
**Goal:** Provide the frontend with status and operations with review details.

**Scope**
- Claim summary, polling status, decisions, trace, audit, document list and safe document retrieval by generated IDs.
- Never expose filesystem paths or arbitrary file reads.
- API errors and status transitions documented in OpenAPI.

**Acceptance criteria**
- Polling endpoint reflects all workflow states, decision availability, and actionable next step.
- Trace omits raw document bytes/secrets.
- Document retrieval resolves only associated document ID and safe MIME/download headers.

### PC-19 — Build Next.js claim submission and operations review UI
**Goal:** Deliver assignment UI against backend contracts.

**Scope**
- Employee ID input/selection, fetch covered people, select patient by name/relationship, claim fields, PDF/images upload and client-side convenience validation.
- Show claim ID/status after submission; poll REST for updates.
- Display actionable missing-document instructions; allow corrections in valid state.
- Operations claim list/detail with decision, trace, audit timeline, retry-validation action, human review action.
- React/Next.js + TypeScript + shadcn/ui; accessible responsive UI.

**Acceptance criteria**
- UI reflects server authority and never selects policy directly.
- Upload errors and gate statuses are distinguishable.
- Audit events and detailed trace are navigable and understandable.
- No frontend secrets; backend remains independently testable.

### PC-20 — Add security, privacy, configuration, and operational metrics
**Goal:** Make safe portfolio use and failure diagnosis straightforward.

**Scope**
- Synthetic/assignment-only data warning and guardrail; env secrets; secure CORS; request size limits; log redaction; no raw document/PHI logging.
- Metrics for queue age/depth, gate and stage latency, attempts, 429/503, token/image use and cost estimate, statuses.
- Configurable upload/gate/provider concurrency/rate limits; spend alert guidance.
- Document limitations: no real claims/auth/compliance assertion.

**Acceptance criteria**
- Tests verify sensitive content/secrets not present in ordinary logs.
- Metrics are useful without sensitive labels/cardinality hazards.
- Operational guide describes provider-limit dashboard, retry controls, and recovery actions.

### PC-21 — End-to-end evaluation, architecture/contracts docs, Docker, CI
**Goal:** Deliver reproducible assignment evidence and local setup.

**Scope**
- Run all 12 test cases; generate full eval report with output, trace, match and mismatch explanation.
- Add synthetic docs spanning guide variations and opt-in real model evaluation.
- Dockerize backend/worker/frontend and local PostgreSQL as appropriate; Docker Compose dev profile.
- GitHub Actions for backend lint/type/tests, frontend lint/type/build, migration/test DB.
- Complete architecture, component contracts, setup, limitations and scale-up path.

**Acceptance criteria**
- One documented local command sequence starts system from clean checkout.
- CI passes without external API credentials; live eval is separately opt-in.
- Eval report and architecture describe actual built behavior, not planned features.
- Repository contains no secrets or real member health information.

## Suggested execution order

`PC-01 → PC-02 → PC-03 → PC-04 → PC-05 → PC-06 → PC-07 → PC-08 → PC-09 → PC-10 → PC-11 → PC-12 → PC-13 → PC-14 → PC-15 → PC-16 → PC-17 → PC-18 → PC-19 → PC-20 → PC-21`

Some UI work can proceed in parallel after PC-02/PC-03 using mocked OpenAPI contracts, but keep backend-first priority. Do not deploy AWS/Supabase/Terraform/Kafka/Redis until the local vertical slice and evaluation establish the need and remaining time permits it.
