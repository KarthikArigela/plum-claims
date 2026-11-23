# 08: Extract structured claim evidence

**What to build:** After the document gate passes, the worker extracts relevant claim facts from the complete document set and preserves which page supports each fact.

**Blocked by:** 07 — Process durable jobs in a separate worker.

**Status:** ready-for-agent

- [ ] Responses API adapter extracts patient, diagnosis/treatment, dates, doctor information, bill totals, line items, and document-specific details as applicable.
- [ ] Structured output is constrained by a strict schema and validated again in backend code.
- [ ] Missing, unreadable, ambiguous, and contradictory values are represented explicitly; the model never fills gaps with guesses.
- [ ] Extracted values retain source document/page references and confidence/evidence needed by trace and policy checks.
- [ ] Provider is called with no policy authority or unnecessary tools; only synthetic/assignment-provided documents are used.
- [ ] Transient errors are bounded by stage retry policy; invalid output or exhausted/permanent failures degrade safely and do not erase prior state.
- [ ] Tests use mocked Responses outputs and cover valid, partial, malformed, missing-field, unreadable, and provider-failure cases.
