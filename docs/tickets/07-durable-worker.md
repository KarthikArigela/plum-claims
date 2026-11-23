# 07: Process durable jobs in a separate worker

**What to build:** A separate worker process reliably claims and runs persisted claim jobs, so accepted work survives API and worker restarts.

**Blocked by:** 03 — Persist idempotent claim submissions; 05 — Gate claims on page-level document validation.

**Status:** ready-for-agent

- [ ] A PostgreSQL-backed job repository supports `VALIDATE_DOCUMENTS` and `PROCESS_CLAIM` job types with distinct job states and claim workflow statuses.
- [ ] Worker process leases a queued job atomically, records owner/expiry, heartbeats long work, and releases/retries expired leases after crashes.
- [ ] Initial worker concurrency is one job at a time; separate worker processes may claim distinct jobs without duplicate ownership.
- [ ] Worker dispatches validation retry jobs to the gate and processing jobs to the sequential claim workflow.
- [ ] Claim/job transitions and associated job creation are transactional where required.
- [ ] Transient processing failures retry within a bounded three-attempt cycle with backoff; permanent/exhausted failures preserve the claim and route to human review.
- [ ] Tests cover competing workers, lease expiry, crash/restart, cancellation/shutdown, and distinct claim/job state semantics.
