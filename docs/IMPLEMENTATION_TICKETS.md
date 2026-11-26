# Plum Claims — Implementation Tickets

Tickets are ordered by dependency and written as demoable vertical slices. Implement each ticket test-first: add the important happy/failure-path tests, implement the smallest passing slice, refactor, then run focused and regression tests. The agreed design is in [`CLAIMS_SYSTEM_SPEC.md`](CLAIMS_SYSTEM_SPEC.md).

Each ticket below is also saved as a separate Markdown file under `docs/tickets/` for copying into Linear. Dependencies are explicit; independent tickets can proceed in parallel once their blockers are complete. Backend and local infrastructure are implemented and accepted before frontend work begins. Existing ticket numbers are retained; 12a is the backend acceptance checkpoint.

## Ticket map

| # | Title | Blocked by |
|---|---|---|
| 01 | Establish the local backend foundation | None |
| 02 | Resolve employee, patient, and policy | 01 |
| 03 | Persist claim submissions safely | 01, 02 |
| 04 | Prove page classification with the Decisions API | 01 |
| 05 | Check claim documents before processing | 03, 04 |
| 06 | Recover interrupted validation and correct documents | 05 |
| 07 | Run durable jobs in a separate worker | 05, 06 |
| 08 | Extract structured claim evidence | 07 |
| 09 | Evaluate policy and produce decisions | 08 |
| 10 | Persist explainable results and recovery checkpoints | 09 |
| 11 | Record human review and audit history | 10 |
| 12 | Expose claim status, trace, and recovery APIs | 06, 07, 10, 11 |
| 12a | Verify backend acceptance and evaluation | 12 |
| 13 | Build member submission and tracking UI | 12a |
| 14 | Build operations review UI | 12a, 13 |
| 15 | Complete evaluation and delivery | 12a, 13, 14 |

## Recommended execution

Start with 01. After it, 02 and 04 can proceed independently; 03 follows 02; then 05. Complete validation recovery before the worker consumes retry jobs, then continue through extraction, policy, trace, review, and API contracts. Run and review backend acceptance in 12a before starting either frontend ticket. Review the previous prototype as a design reference during the UI tickets, then finish with 15. Revisit dependency edges if implementation evidence shows a genuine blocker or an opportunity to merge or split a slice.
