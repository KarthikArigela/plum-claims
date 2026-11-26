# 07: Run durable jobs in a separate worker

**Goal:** Queued claim work survives API and worker restarts and is handled by only one worker at a time.

**Blocked by:** 05 — Check claim documents before processing; 06 — Recover interrupted validation and correct documents.

**Status:** ready-for-agent

## Scope

- Run a separate worker that claims PostgreSQL jobs, renews its lease while working, and makes abandoned jobs available again.
- Support the existing validation-retry job and a processing-job dispatch boundary; keep job execution state separate from claim status.
- Bound processing retries and preserve claims when work fails.

## Out of scope

- Full claim extraction, policy decisions, and cross-stage checkpoints; later tickets deliver those stages.
- Additional queue infrastructure, cloud deployment, and frontend work.

## Acceptance criteria

- [ ] A queued validation-retry job is picked up by the worker and runs the existing document gate; a passing result can queue processing under the same claim.
- [ ] A worker claims jobs atomically, records and renews its lease, and makes expired work available after a crash. Competing workers cannot own the same live lease.
- [ ] One worker handles one job at a time initially; separate workers can handle different jobs. Job status remains distinct from claim status.
- [ ] A processing job is dispatched only when a real processing handler is available. Before later stages exist, it must not be marked successful using placeholder work.
- [ ] Transient processing failures are retried with bounded backoff and no more than three attempts per cycle; permanent or exhausted failures preserve the claim and route it for human review with a safe failure record.
- [ ] Required claim and job transitions are consistent, including shutdown, lease expiry, and restart.

## Verification

- Run the worker against a queued validation retry and exercise processing dispatch with controlled test handlers; confirm restart and lease recovery using test data.
- Run focused tests for competing workers, heartbeat and expiry, crash recovery, shutdown, retry limits, and separate claim/job states.
- Run relevant backend lint and type checks; report unrelated existing failures separately. Normal checks should not require AI credentials.

## Implementation boundaries

Keep changes focused on the worker, durable job handling, existing validation dispatch, and tests. Do not create placeholder claim decisions or implement later processing stages.
