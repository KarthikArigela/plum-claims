# Plum Claims — Implementation Tickets

Tickets are ordered by dependency and written as demoable vertical slices. Implement each ticket test-first: add the important happy/failure-path tests, implement the smallest passing slice, refactor, then run focused and regression tests. The agreed design is in [`CLAIMS_SYSTEM_SPEC.md`](CLAIMS_SYSTEM_SPEC.md).

Each ticket below is also saved as a separate Markdown file under `docs/tickets/` for copying into Linear. Dependencies are explicit; independent tickets can proceed in parallel once their blockers are complete. Backend-first remains the priority.

## Ticket map

| # | Title | Blocked by |
|---|---|---|
| 01 | Establish local app foundation | None |
| 02 | Resolve employee, patient, and policy | 01 |
| 03 | Persist idempotent claim submissions | 01, 02 |
| 04 | Prove Decisions API page classification | 01 |
| 05 | Gate claims on page-level document validation | 03, 04 |
| 06 | Recover uncertain and interrupted validation | 05 |
| 07 | Process durable jobs in a separate worker | 03, 05 |
| 08 | Extract structured claim evidence | 07 |
| 09 | Evaluate policy and produce decisions | 08 |
| 10 | Persist explainable results and recovery checkpoints | 09 |
| 11 | Record human review and audit history | 10 |
| 12 | Expose claim status, trace, and recovery APIs | 06, 07, 10, 11 |
| 13 | Build member submission and tracking UI | 02, 03, 05, 12 |
| 14 | Build operations review UI | 11, 12 |
| 15 | Complete evaluation and delivery documentation | 05, 09, 10, 13, 14 |

## Recommended execution

Start with 01. After it, 02 and 04 can proceed independently; 03 follows 02; then 05. Continue through worker, extraction, policy, trace, and review. UI tickets remain downstream of backend contracts. Finish with 15. Revisit dependency edges if implementation evidence shows a genuine blocker or an opportunity to merge/split a slice.
