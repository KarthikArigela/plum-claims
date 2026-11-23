# 13: Build member submission and tracking UI

**What to build:** A member can select their employee/patient context, submit supported files, understand gate outcomes, correct a document issue, and track processing to a decision.

**Blocked by:** 02 — Resolve employee, patient, and policy; 03 — Persist idempotent claim submissions; 05 — Gate claims on page-level document validation; 12 — Expose claim status, trace, and recovery APIs.

**Status:** ready-for-agent

- [ ] Employee ID entry calls backend covered-people lookup and displays patient choices by name/relationship.
- [ ] Claim form captures required assignment fields and PDF/image documents; frontend checks are convenience only and backend remains authoritative.
- [ ] Submission uses idempotency behavior and displays claim ID/status once persistence succeeds.
- [ ] UI distinguishes invalid file errors, `NEEDS_DOCUMENTS`, `DOCUMENT_REVIEW_REQUIRED`, `VALIDATION_RETRY_PENDING`, processing, and terminal decisions with clear next steps.
- [ ] REST polling updates status and result without exposing policy selection or frontend secrets.
- [ ] Member may add requested files only in allowed state and sees the same claim ID and preserved history.
- [ ] Accessible responsive Next.js/shadcn UI tests cover key form, errors, status updates, and correction flow.
