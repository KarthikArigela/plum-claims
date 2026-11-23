# 06: Recover uncertain and interrupted validation

**What to build:** Members can correct a clearly incomplete submission without losing its claim identity, while provider outages leave a durable retryable claim rather than a false document judgment.

**Blocked by:** 05 — Gate claims on page-level document validation.

**Status:** ready-for-agent

- [ ] Claims whose gate was blocked by provider failure/deadline/attempt exhaustion remain `VALIDATION_RETRY_PENDING`, retain files and successful page results, and never enter extraction.
- [ ] A validation cycle allows at most three actual network attempts per failed page batch; only failed batches repeat; successful batches are retained.
- [ ] An explicit operations retry request records actor/action and queues a durable `VALIDATE_DOCUMENTS` job for a new cycle of up to three attempts; no endless automatic cycles.
- [ ] New requested documents can be added only while `NEEDS_DOCUMENTS`; the same claim ID is retained and the full current set is revalidated.
- [ ] Documents cannot be modified during active processing; state changes and job creation avoid racing validation and processing jobs.
- [ ] The configured 60-second overall gate deadline includes rendering, provider calls, waits, and final checks, but excludes upload transfer; expiry persists retry-pending state.
- [ ] Retry handling honors `Retry-After`, uses bounded backoff/jitter when absent, distinguishes permanent errors, and accounts for SDK retries so wire attempts stay within budget.
- [ ] Tests cover timeout, 429/503, permanent quota/auth/schema errors, deadline, retry of failed batch only, operator retry cycle, corrections under same ID, and concurrency races.
