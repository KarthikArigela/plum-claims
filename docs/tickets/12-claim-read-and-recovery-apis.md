# 12: Expose claim status, trace, and recovery APIs

**What to build:** Members and operations users can retrieve the right claim state and next action, follow processing by polling, inspect the audit/trace, and perform allowed correction/recovery actions through stable REST contracts.

**Blocked by:** 06 — Recover uncertain and interrupted validation; 07 — Process durable jobs in a separate worker; 10 — Persist explainable results and recovery checkpoints; 11 — Record human review and audit history.

**Status:** ready-for-agent

- [ ] OpenAPI documents claim summary/status, decision, audit events, detailed trace, documents, and actionable next steps.
- [ ] Polling reads report current claim status, separate job status where useful, and decision availability.
- [ ] Trace and event responses omit raw document bytes, filesystem paths, secrets, and unnecessary sensitive content.
- [ ] Document APIs resolve only document IDs belonging to the claim and never allow arbitrary path access.
- [ ] Document correction and operator validation retry endpoints enforce the agreed claim states and same-claim history.
- [ ] Human review API preserves append-only automated and human decision records.
- [ ] API integration tests cover state/status response behavior, errors, privacy boundaries, and disallowed transitions.
