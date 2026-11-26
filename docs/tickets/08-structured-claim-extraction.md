# 08: Extract structured claim evidence

**Goal:** Extract the facts needed to evaluate a claim and show which document page supports each fact, without guessing missing information.

**Blocked by:** 07 — Run durable jobs in a separate worker.

**Status:** ready-for-agent

## Scope

- Extract patient, treatment, dates, doctor details, bill amounts, line items, and other relevant facts from a passed document set using structured AI output.
- Validate the output and retain source references, confidence, and uncertainty for later policy checks and trace.
- Handle extraction failures safely within the worker's bounded retry rules.

## Out of scope

- Policy decisions, final claim outcomes, and the complete cross-stage trace and checkpoint workflow.
- Live-model-dependent ordinary tests and frontend implementation.

## Acceptance criteria

- [ ] Valid extraction returns structured claim facts appropriate to the supplied documents, with references to the supporting document and page.
- [ ] Missing, unreadable, ambiguous, and conflicting facts are represented explicitly; unsupported values are not invented.
- [ ] Malformed or incomplete provider output is validated before use and cannot silently become trusted policy evidence.
- [ ] The model has no policy-decision authority or unnecessary tools. Document content and sensitive extracted values are not written to ordinary logs.
- [ ] Provider failures and invalid output follow bounded retry or safe failure handling without erasing the claim or prior results.
- [ ] The extraction stage can be exercised using the worker's processing boundary without marking the overall claim complete before later stages exist.

## Verification

- Exercise extraction with synthetic or assignment-provided documents and mocked responses covering valid and partial results.
- Run focused tests for source references, missing or conflicting facts, invalid output, unreadable pages, and provider failures; normal checks should not require AI credentials.
- Run relevant backend lint and type checks; report unrelated existing failures separately.

## Implementation boundaries

Keep changes focused on structured extraction, its provider boundary, evidence representation, and tests. Use the agreed backend specification; policy calculations and final decisions remain later work.
