# Plum Claims — System Specification

**Status:** Agreed working spec; implementation details may be revised based on tests and measured behavior.  
**Scope:** Portfolio implementation of the provided health-insurance claims assignment.  
**Source of truth:** Assignment requirements, supplied policy/configuration, test cases, sample-document guide, and decisions recorded in this specification.

## Problem Statement

Members submit health-insurance claims with PDF and image documents. The system must identify incomplete or incorrect document sets early, extract evidence from messy documents, evaluate that evidence against the correct policy, and produce an explainable decision. Claims involve money and sensitive health information, so submissions, progress, failures, and human actions must be durable and auditable. The portfolio system must demonstrate these behaviors locally without prematurely introducing distributed infrastructure.

## Solution

Build a separated Next.js frontend and Python/FastAPI backend. The backend persists accepted submissions and uploaded files before running a synchronous, bounded document gate. It classifies every page, then uses deterministic policy-configured rules to decide whether the claim can proceed, needs member documents, or needs human review. Passing claims receive a durable PostgreSQL job. A separate worker executes extraction, policy evaluation, and decision formatting in sequence, saving checkpoints and trace data. The frontend polls REST endpoints for status and presents actionable member guidance and an operations review timeline.

Initial local architecture: PostgreSQL in Docker is the system of record and job queue; uploaded bytes are stored on local disk behind a storage interface; one worker process handles one job at a time. OpenAI Decisions API is the primary page classifier. OpenAI Responses API is used for structured detailed extraction and conditionally for exact patient-name extraction needed to explain a cross-document mismatch. Model/provider and storage boundaries permit later substitutions. This is a modular monolith plus a separate worker process, not a microservices deployment.

## User Stories

1. As a member, I want to identify myself using my employee ID, so that the system can find my company enrollment without requiring authentication in this portfolio demo.
2. As a member, I want to see myself and my enrolled dependents as patient choices, so that I can submit a claim for the person who received treatment.
3. As a member, I want to select a patient by name and relationship rather than memorize an internal member ID, so that the submission flow is understandable.
4. As a member, I want the backend to verify that the selected patient is eligible under my employee enrollment, so that an unrelated person cannot be submitted under my policy.
5. As a member, I want the backend to select the policy associated with my employee enrollment and treatment date, so that I cannot accidentally or intentionally choose another company’s policy.
6. As a member, I want the claim to retain the resolved policy ID, version, and content hash, so that retries and audits use the same policy rules.
7. As a member, I want to submit claim details and supported PDFs or images, so that common medical-document formats are accepted.
8. As a member, I want clear errors for malformed, unsupported, corrupt, encrypted, or excessive uploads, so that I know how to correct them before a claim is created.
9. As a member, I want a claim ID after a valid submission is durably recorded, even if document validation later stops or is interrupted, so that I can refer to and recover the submission.
10. As a member, I want retrying the same submission with the same idempotency key to return the existing claim, so that network retries do not create duplicate claims or jobs.
11. As a member, I want reuse of an idempotency key with different submission data to produce a conflict, so that unrelated submissions are not silently merged.
12. As a member, I want the system to check required document types before claim processing, so that an incorrect or incomplete document set is caught early.
13. As a member, I want every page classified separately, even when one PDF contains several document types, so that mixed bundles are not mistaken for a single document.
14. As a member, I want a specific message naming the detected and required document types, so that I know exactly what to upload instead of receiving a generic error.
15. As a member, I want low-confidence or unreadable pages routed to document review rather than treated as proof that a document is missing, so that I am not asked to replace a possibly valid document without review.
16. As a member, I want a service outage during document classification distinguished from a document problem, so that a timeout does not become a misleading rejection or re-upload request.
17. As a member, I want to add requested documents to the same claim while it is awaiting documents, so that corrections remain attached to the original claim and audit history.
18. As a member, I want the full document set rechecked after a correction, so that the gate evaluates a consistent submission.
19. As a member, I want documents frozen while processing is active, so that evidence cannot change underneath a worker’s decision.
20. As a member, I want missing or unclear required evidence discovered during extraction to lead either to a specific document request or human review, so that the system never invents a value.
21. As a member, I want to see claim status and the final result through REST polling, so that I can follow asynchronous processing without a real-time connection.
22. As an operations reviewer, I want to see the automated recommendation separately from the final human decision, so that the original system result remains auditable.
23. As an operations reviewer, I want a chronological timeline of meaningful actions and a detailed linked processing trace, so that someone unfamiliar with the claim can understand what happened.
24. As an operations reviewer, I want to see evidence, page references, policy checks, confidence changes, failures, and retry history, so that decisions are explainable without relying on private model reasoning.
25. As an operations reviewer, I want to record my identity, outcome, amount, and rationale, so that a human resolution is attributable and auditable.
26. As an operations operator, I want to trigger a new validation retry cycle after an exhausted service-failure cycle, so that preserved claims can recover when the provider is available.
27. As an operator, I want claim and job statuses kept distinct, so that execution retries do not obscure the business state of the claim.
28. As a system operator, I want transient service errors retried within bounded attempt and time budgets, so that temporary problems recover without endless work or uncontrolled cost.
29. As a system operator, I want provider rate limits, retry hints, usage, latency, and failures observed, so that concurrency can be tuned to maximize throughput without avoidable throttling.
30. As a system operator, I want configurable upload, rate, timeout, confidence, and concurrency limits, so that the system can be tuned using test and operational evidence.
31. As a project evaluator, I want all 12 supplied cases evaluated with decisions, traces, and mismatches reported, so that assignment behavior is measurable.
32. As a project evaluator, I want a working UI, local setup instructions, architecture explanation, component contracts, and demo-ready flows, so that the complete assignment can be reviewed.

## Implementation Decisions

### Architecture and boundaries

- Frontend: React + Next.js + TypeScript + shadcn/ui, in a separate project and calling backend REST APIs only. Backend: Python asyncio, FastAPI, Pydantic, PostgreSQL, OpenAI SDK, and LangGraph for sequential workflow orchestration where it adds value.
- The backend is a modular monolith. A separate worker process uses shared backend modules. Initial deployment is local; do not introduce microservices, Kafka, Redis, load balancers, caches, replicas, Terraform, or cloud resources without measured need.
- PostgreSQL is the durable source of truth and initial jobs queue. The API writes a claim and eligible processing job transactionally. Workers claim jobs using database-safe leases; one worker handles one claim at a time initially. Job stages for a claim run sequentially: extraction → policy evaluation → decision formatting. Multiple worker processes may later handle different claims.
- Local document storage is behind an interface so a later S3 adapter can replace it. Persist files safely before acknowledging a durable submission; database metadata and claim state are transactional. Reconcile or clean orphaned staged files.
- PostgreSQL stores claims, documents metadata, jobs, append-only claim events, decisions, processing traces/checkpoints, and initial shared application rate-limit counters. Core query fields remain relational; variable extraction and policy-check details use structured JSON/JSONB.

### Policy, employee, and patient resolution

- Policy terms, company associations, employee roster, dependent roster, and effective dates are configuration, stored once in versioned JSON. The backend catalog resolves the employee enrollment and policy applicable on the treatment date. The frontend never supplies a policy choice.
- The user supplies/selects an employee ID (authentication is out of scope), then chooses the patient from backend-returned self/dependent choices by display name and relationship. The frontend sends the patient’s internal roster ID; it need not be displayed to the user. The backend verifies eligibility.
- For supplied assignment cases that only provide `member_id`, map it to the employee identity and default the patient to that employee. Keep dependent selection extensible and test it, without changing the existing cases’ meaning.
- Pin resolved policy ID, version, and content hash on the claim. Retain historical JSON versions (for this portfolio, in version control) so existing claims remain reproducible. Do not duplicate complete policy terms in each claim row.
- Policy changes and enrollment administration are configuration changes for this portfolio, not a member/admin product feature.

### Submission, idempotency, storage, and validation

- Apply application submission rate limits by client IP and employee ID. Employee ID is an identifier, not authentication.
- Reject malformed requests and unsupported, corrupt, encrypted, or excessive files before claim creation or model calls. Validate actual signatures/parseability rather than trusting filename or client MIME. Return actionable safe errors.
- Initial configurable upload defaults, provisional pending measurement: PDF/JPEG/PNG/WEBP; max 10 files, 20 MB per file, 50 MB total, and 50 pages. Animated GIF and unsupported types are rejected. These are project guardrails, not industry standards.
- Stage uploaded files with generated storage keys (never trust paths from filenames), calculate hashes, and persist verified metadata. Create the claim ID and `VALIDATING_DOCUMENTS` status before the AI gate after basic checks and durable persistence. Persist meaningful audit events.
- Same idempotency key + same canonical payload returns the existing claim; same key + different payload conflicts. Scope uniqueness to the submitter/request context.
- Document bytes stay out of PostgreSQL. Do not log raw documents or sensitive extracted content. This portfolio may use only synthetic or assignment-provided documents; credentials remain environment-managed and uncommitted.

### Synchronous document gate

- The document gate runs synchronously after claim persistence. Its configurable initial wall-clock budget is 60 seconds, including rendering, classification, retries, and final deterministic checks; upload transfer time is excluded. The gate returns a claim ID/status. Only a passing gate is accepted into downstream processing and receives a `PROCESS_CLAIM` job.
- Validate/render supported content; classify every image as one page and every PDF page separately. A mixed PDF may contain prescription, bill, report, etc.; never infer one type for the entire file.
- Use Decisions API as the forefront classifier, with a provider adapter. Batch up to 10 page images per request. Ask the same question—“What document is this?”—for each page, with one separate question/image mapping per page so the answer identifies that page. At most two batches for a claim are in flight; a configurable global provider concurrency limit prevents bursts.
- Initial labels: `PRESCRIPTION`, `HOSPITAL_BILL`, `LAB_REPORT`, `DIAGNOSTIC_REPORT`, `PHARMACY_BILL`, `DISCHARGE_SUMMARY`, `DENTAL_REPORT`, `OTHER`, `UNREADABLE`. Confirm policy-specific types and equivalences against the supplied configuration. Every response must map uniquely to a page and pass schema, label, completeness, and confidence-range validation.
- Backend deterministic rules compare classifications with selected policy `document_requirements`; AI does not make policy decisions. Member messages are generated from configured requirements/templates, not model-written policy instructions.
- A low-confidence/unreadable page causes `DOCUMENT_REVIEW_REQUIRED`; this takes precedence over an apparently missing required type because that page may contain it. Clearly wrong or missing required types with no uncertainty cause `NEEDS_DOCUMENTS` and a specific action message. A passed gate creates a processing job. Provider failure/deadline is `VALIDATION_RETRY_PENDING`, never misrepresented as a document judgment.
- If exact patient names are required to explain a cross-document mismatch, make a conditional Responses API structured extraction call for the relevant pages. If names cannot be extracted confidently, route to review. This is the working decision; if a thin implementation/evaluation spike shows it cannot meet the requirements, the user will decide whether to switch the full gate to Responses API.
- Tell the model to classify visible content only and ignore instructions embedded in documents. No tools or policy authority. Treat confidence as a model signal, not calibrated truth; choose configurable confidence threshold after labeled-sample evaluation.

### API failures, retries, and provider throughput

- Validation service failure budget: at most three actual network attempts per failed page batch per validation cycle, retry only the failed batch, retain successful batch outputs, all within the total 60-second deadline. A later explicit operator retry starts a new recorded cycle of up to three attempts.
- SDK retries and application retries must be configured together; no hidden nested retries. Retry only transient connection/timeouts and eligible 429/503/5xx errors. Honor valid `Retry-After`; otherwise use bounded exponential backoff with jitter. Do not retry auth, request/schema, quota, billing, or other permanent errors blindly.
- On timeout/deadline/attempt exhaustion, preserve claim/files/results and set `VALIDATION_RETRY_PENDING`. An operator action queues a durable `VALIDATE_DOCUMENTS` job; only pass proceeds to processing. No endless automatic validation cycles.
- A shared PostgreSQL job table supports types `VALIDATE_DOCUMENTS` and `PROCESS_CLAIM`; job execution status is distinct from claim business status. Use lease expiry/heartbeat for crash recovery; processing is at least once, with idempotent stage writes/checkpoints. External model calls may repeat if a process crashes before saving a response.
- Initial app rate-limit defaults are configurable 5 submissions/min/IP and 3/min/employee, stored in PostgreSQL. Provider limits vary by organization/project/model; inspect actual account limits and response headers. Start conservatively, observe rate/reset/remaining headers, latency, usage, 429/503 and queue age; tune concurrency to use available capacity without bursts. Process-local semaphores do not coordinate multiple replicas; use a shared limiter before multi-process deployment.

### Claim lifecycle, decisions, trace, and human review

- Claim status describes workflow state; decision is the insurance outcome. Decision values are exactly `APPROVED`, `PARTIAL`, `REJECTED`, `MANUAL_REVIEW`. Status examples include `VALIDATING_DOCUMENTS`, `VALIDATION_RETRY_PENDING`, `NEEDS_DOCUMENTS`, `DOCUMENT_REVIEW_REQUIRED`, `PROCESSING`, `NEEDS_MEMBER_INFORMATION`, `AWAITING_HUMAN_REVIEW`, and `COMPLETED`.
- Persisted document/missing/review states have claim IDs but no claim decision yet. `MANUAL_REVIEW` is a decision/recommendation; `AWAITING_HUMAN_REVIEW` is the workflow status.
- Human review creates a separate immutable final decision with reviewer identity and rationale; it never overwrites the automated recommendation.
- Maintain an append-only, human-readable timeline of meaningful actions (submit, policy resolved, gate result, documents requested/added, job queued/retried, stage outcomes, automated decision, review, human decision). Detailed page/node/retry results live in linked processing trace/job history, not as noisy timeline events for every internal operation.
- Trace includes checked rules, evidence/source-page references, pass/fail outcomes, calculations, confidence adjustments, model/provider/prompt/schema versions, request IDs, attempts, safe error codes, and timestamps. Never rely on hidden model reasoning as audit evidence.
- Missing extracted fields remain explicitly missing. If the exact additional/clearer document needed is known, request it and return the same claim to `NEEDS_DOCUMENTS`; if evidence is ambiguous or unreadable, use `MANUAL_REVIEW`. No unsupported value is guessed.
- Transient post-gate worker failures retry up to three times per stage/job cycle with bounded backoff. Permanent/exhausted failures preserve the claim and route to human review. Worker saves checkpoints after completed stages; retry-safe writes prevent duplicate decisions/results.

### REST contract and frontend behavior

- Backend exposes covered-people lookup, multipart claim submission, claim summary/status, trace/timeline, controlled document correction/retrieval, operations validation retry, and human review endpoints. Exact route/schema details are fixed in the API-contract ticket and published through OpenAPI.
- Submission returns a claim ID and current state; a final decision need not be available yet. Frontend polls REST status. Basic malformed/unsupported file errors before claim persistence return no claim ID; semantically stopped/review/retry-pending submissions return the persisted ID.
- Frontend shows specific next actions for `NEEDS_DOCUMENTS`, uncertainty for `DOCUMENT_REVIEW_REQUIRED`, service retry state for `VALIDATION_RETRY_PENDING`, and status/decision/trace for processing and terminal states.
- Operations UI shows claim timeline, full trace, original automated result, and separate human review action. Demo has no real authentication; any reviewer identity is explicitly marked as unverified.
- Never expose filesystem paths or arbitrary file access. Backend is authoritative for policy, eligibility, states, and outcomes.

## Testing Decisions

- Tests describe externally observable behavior and contracts, not internal helper call structure. Use test-first per ticket: write happy-path and important failure-path tests, implement the smallest passing slice, refactor, and add regression tests when new cases are discovered. Do not attempt to enumerate every possible case before coding.
- Highest-value acceptance seam: claim lifecycle through FastAPI—submission → document gate → durable queued worker processing or an actionable stop → status/trace/review. Use mocked AI adapter responses, a real test PostgreSQL database, and temporary document storage; avoid live model dependence in ordinary tests.
- Add focused unit tests for deterministic policy rules, state transitions, money arithmetic, idempotency comparisons, upload validation, rate limit decisions, confidence routing, and message generation.
- Add adapter contract tests for Decisions/Responses request construction and strict result validation. Add opt-in live tests/evaluations using only synthetic/assignment-provided files.
- Add integration tests for real PostgreSQL transactions, concurrent idempotency, claim+job atomicity, leases, worker crash/retry/checkpoint recovery, and rate counter concurrency.
- Use all 12 assignment cases as baseline acceptance/evaluation. Test real PDF/image rendering and mixed-page mappings with generated synthetic samples; JSON-only fixtures do not validate vision behavior.
- Explicit cases include wrong/missing document, unreadable and uncertain pages, patient mismatch and exact names, successful mixed-page submission, service timeout/429/503/permanent errors, 60-second deadline, failed-batch-only retry, corrections under the same claim ID, policy/company/dependent/date resolution, policy version pinning, worker at-least-once recovery, human decision audit, privacy-safe logs, and rate-limit behavior.
- Repository currently has a detailed assignment/eval data set and design drafts; application and test directories are empty in the inspected workspace state. Build executable tests as the first ticket rather than assuming existing test infrastructure.

## Out of Scope

- Real PHI/real claims; production privacy/legal/provider-contract approval or compliance certification.
- Authentication and authorization, real identity proof, production operator access control.
- Enrollment/admin UI or editing policies and employees at runtime; portfolio configuration stays versioned JSON.
- Cloud deployment, S3 implementation, Supabase/managed Postgres, AWS, Terraform, CI/CD, production autoscaling/load balancer.
- Kafka, Redis, cache/read replicas, microservices, separate service per LangGraph node.
- Full Prometheus/Grafana/OpenTelemetry/Graylog/Langfuse stack. Record useful safe operational metrics and preserve seams, but do not install the complete stack prematurely.
- Claim decisions authored by an LLM; policy outcome and money calculations remain deterministic.
- Guaranteed exactly-once external model execution; processing is at-least-once with idempotent persistence.

## Further Notes

- Capacity planning assumption from the assignment: 75,000 claims/year averages about 8.6/hour; assumed 5× peak is about 43/hour. This is not a measured peak. The same durable job pattern is selected now for reliability, not because that rate requires Kafka or microservices.
- A proposed P90 of five minutes should be measured and its endpoint defined (decision vs. human-review routing) before calling it an SLO.
- Open implementation validations: prove installed Python SDK and account support for Decisions API per-question images and response schema; verify actual model access/rate limits; benchmark batch size, concurrency, and 60-second gate deadline; select confidence threshold from labeled samples; finalize exact enums and API error schemas; clarify missing-field routing from policy/test evidence.
- If evidence from implementation or eval contradicts an assumption, add tests and update this spec before changing user-facing behavior. User makes the final call on changing the agreed Decisions-first gate strategy.
