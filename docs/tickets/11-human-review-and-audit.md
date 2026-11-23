# 11: Record human review and audit history

**What to build:** An operations reviewer can inspect the automated recommendation and claim history, then record a separate final decision with attribution and rationale.

**Blocked by:** 10 — Persist explainable results and recovery checkpoints.

**Status:** ready-for-agent

- [ ] Review view data includes automated result, relevant trace/evidence, member actions, retries, and meaningful chronological events.
- [ ] Human reviewer can record actor identity, final decision, approved amount where applicable, rationale, and timestamp.
- [ ] Human decision is a new immutable record and does not overwrite the automated recommendation, including an automated `MANUAL_REVIEW` decision.
- [ ] Append-only timeline records meaningful lifecycle actions; detailed node retries remain in job/processing history.
- [ ] Unauthenticated demo explicitly marks reviewer identity as unverified and does not imply production authorization.
- [ ] Tests cover audit ordering, distinct automated/human records, reviewer rationale, and allowed review-state transitions.
