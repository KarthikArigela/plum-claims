# 06: Recover interrupted validation and correct documents

**Goal:** A member can correct an incomplete claim without losing its identity, and an operator can recover validation after a service failure without mistaking it for a document problem.

**Blocked by:** 05 — Check claim documents before processing.

**Status:** ready-for-agent

## Scope

- Allow requested documents to be added to an eligible claim and recheck the full document set under the same claim ID.
- Bound validation attempts and the overall time budget, preserving successful results when a provider fails.
- Allow an operator to request a new validation cycle by recording the action and queuing a durable retry job. Ticket 07 runs that job.

## Out of scope

- Running the separate worker or automatically starting endless retry cycles.
- Claim extraction, policy decisions, and frontend implementation.

## Acceptance criteria

- [ ] A claim awaiting documents accepts additional files, retains its claim ID and history, and revalidates the full current set. Documents cannot be changed while processing is active or in other disallowed states.
- [ ] Provider failure, deadline expiry, or exhausted attempts leaves the claim in `VALIDATION_RETRY_PENDING`, preserving files and successful page results without starting extraction.
- [ ] A validation cycle makes at most three actual network attempts per failed batch, retries only failed batches, and retains successful results. SDK retries are included in that limit.
- [ ] The configurable 60-second gate budget includes rendering, provider calls, waiting, and final checks but excludes upload transfer. Expiry leaves a recoverable claim.
- [ ] Transient failures respect provider retry guidance or bounded backoff; permanent authentication, quota, and request errors are not blindly retried.
- [ ] An explicit operator request records an unverified actor and action and queues one `VALIDATE_DOCUMENTS` job for a new cycle; no automatic cycles repeat indefinitely.
- [ ] Concurrent corrections, retry requests, and processing transitions do not create conflicting active work or alter documents during processing.

## Verification

- Exercise a document correction and a failed validation followed by an operator retry request; confirm the same claim and history are retained. Verify the queued job without requiring ticket 07's worker.
- Run focused tests for timeouts, transient and permanent failures, attempt and deadline limits, failed-batch-only retries, state restrictions, and concurrency races.
- Run relevant backend lint and type checks; report unrelated existing failures separately. Normal checks should not require AI credentials.

## Implementation boundaries

Keep changes focused on validation recovery, document correction, retry-job creation, and tests. Use the backend specification for retry and state rules; worker execution belongs to ticket 07.
