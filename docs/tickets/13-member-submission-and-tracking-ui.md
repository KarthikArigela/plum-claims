# 13: Build member submission and tracking UI

**Goal:** A member can submit a claim, understand any document issue, and follow the same claim through to its outcome.

**Blocked by:** 12a — Verify backend acceptance and evaluation.

**Status:** ready-for-agent

## Scope

- After backend acceptance, review the previous prototype's submission and claim screens as design references and identify improvements before implementing the member flow.
- Build a separate responsive Next.js interface using the agreed frontend stack and completed backend APIs.
- Support patient selection, claim submission, document correction, and status tracking without moving policy decisions to the frontend.

## Out of scope

- Operations review interface, changes to backend policy logic, and real authentication.
- Automatically copying the previous prototype's backend, assets, or design; reuse assets only when licensing permits.

## Acceptance criteria

- [ ] Entering an employee ID displays backend-provided patient choices by name and relationship; the member does not select a policy.
- [ ] The form collects the required claim details and supported documents. Backend validation remains authoritative, and submission retries do not create duplicate claims.
- [ ] Once a claim is stored, its ID and current status are visible. Invalid uploads are clearly distinguished from a stored claim requiring documents, review, or service recovery.
- [ ] The interface explains the next action for `NEEDS_DOCUMENTS`, `DOCUMENT_REVIEW_REQUIRED`, and `VALIDATION_RETRY_PENDING`, and shows processing and final decisions distinctly.
- [ ] Status and results update through API polling. Requested files can be added only when allowed, while retaining the claim ID and visible history.
- [ ] The interface is responsive and accessible for the main submission, error, tracking, and correction flows, and exposes no provider credentials.

## Verification

- Review the prior prototype and agree on the member-flow improvements before implementing the screens.
- Exercise a successful submission, an invalid file, a document correction, and status updates against the backend.
- Run focused frontend tests and relevant lint, type, and build checks; report unrelated existing failures separately.

## Implementation boundaries

Keep changes focused on the member interface and its backend integration. Treat the previous prototype as a reference, not as the authoritative implementation; operations review belongs to ticket 14.
