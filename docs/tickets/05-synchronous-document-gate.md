# 05: Check claim documents before processing

**Goal:** A submitted claim is checked page by page, so clear document problems receive specific next steps and only a complete, confident document set proceeds to processing.

**Blocked by:** 03 — Persist claim submissions safely; 04 — Prove page classification with the Decisions API.

**Status:** ready-for-agent

## Scope

- Classify each PDF page or image separately, retaining its document and page identity, and compare results with the selected policy's document requirements.
- Use the Decisions API capability proven in ticket 04 — Prove page classification with the Decisions API, with bounded batches and validated responses. Generate member guidance from backend rules, not model-written policy decisions.
- Persist the gate outcome and create a durable processing job only when the document set passes.
- Use conditional structured name extraction when needed to explain a cross-document patient mismatch.

## Out of scope

- Document correction and explicit validation retry cycles, which are covered by ticket 6: Recover interrupted validation and correct documents.
- Running processing jobs, extracting full claim evidence, and making claim decisions.
- Frontend implementation.

## Acceptance criteria

- [ ] Each PDF page and uploaded image has its own validated classification linked to the correct document and page, including mixed-type PDFs and multiple files.
- [ ] Classifications use the agreed document labels, including `OTHER` and `UNREADABLE`, with applicable policy-configured equivalences. Batches contain at most 10 pages and each page receives its own answer; concurrency is bounded according to the backend specification.
- [ ] The confidence threshold is configurable and its selection is informed by labeled examples; model confidence is not treated as calibrated certainty.
- [ ] Clearly missing or wrong required documents produce `NEEDS_DOCUMENTS`, retain the claim ID and gate evidence, and name the detected and required types with a specific next step. No processing job is created.
- [ ] A low-confidence or unreadable page produces `DOCUMENT_REVIEW_REQUIRED` instead of an assumed missing-document result, and no processing job is created.
- [ ] When exact names are needed to explain a patient mismatch, relevant pages are checked; uncertain names route to review rather than a guessed mismatch.
- [ ] A confident, complete document set produces `PROCESSING` and exactly one durable `PROCESS_CLAIM` job, recorded atomically with the status change.
- [ ] Provider failures are not reported as document problems: the claim and files are retained in `VALIDATION_RETRY_PENDING`, with no processing job. Bounded retries and recovery are completed in ticket 06.

## Verification

- Exercise complete, clearly incomplete, and uncertain document sets, including a mixed-page PDF, using synthetic files and mocked provider results.
- Run focused tests for page mapping, output validation, confidence boundaries, patient mismatch, job creation, and provider failure. Normal checks should not require AI credentials.
- Run relevant backend lint and type checks; report unrelated existing failures separately.

## Implementation boundaries

Keep changes focused on the document gate, page classification, required gate records and job creation, and their tests. Use the selected policy and agreed backend specification; do not build the worker or broader claim workflow.
