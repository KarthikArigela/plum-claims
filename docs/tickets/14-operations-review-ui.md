# 14: Build operations review UI

**What to build:** An operations user can find a claim, understand the automated decision and its evidence, see the action timeline, retry validation after service failure, and record a human outcome.

**Blocked by:** 11 — Record human review and audit history; 12 — Expose claim status, trace, and recovery APIs.

**Status:** ready-for-agent

- [ ] Operations view lists claims by workflow status and opens a claim detail/review view.
- [ ] Detail view separates claim workflow status, job execution status, automated decision, and human final decision.
- [ ] Reviewer can navigate a readable event timeline and detailed trace including evidence/page references, policy checks, confidence changes, retries, and safe failure messages.
- [ ] Operator can request a new validation cycle only when allowed and see queued/running/retry outcome.
- [ ] Reviewer can submit final decision, amount when applicable, rationale, and identity through backend API.
- [ ] UI indicates demo reviewer identity is unverified; no raw model payload, secret, or local filesystem path is exposed.
- [ ] UI tests cover trace rendering, decision separation, retry, review submission, and relevant status changes.
