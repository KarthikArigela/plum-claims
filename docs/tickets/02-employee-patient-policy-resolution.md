# 02: Resolve employee, patient, and policy

**Goal:** Given an employee and treatment date, the backend identifies eligible patient choices and resolves the correct policy for the claim.

**Blocked by:** 01 — Establish the local backend foundation.

**Status:** ready-for-agent

## Scope

- Load and validate the supplied policy and member data, with support for versioned policy, company, and roster configuration.
- Provide a covered-people lookup so a member can identify the employee and available dependents by name and relationship.
- Validate the selected patient and resolve the policy associated with the employee's enrollment on the treatment date.
- Make the resolved policy ID, version, and content hash available for later claim creation, while preserving compatibility with the assignment's `member_id` cases.

## Out of scope

- Member-facing UI, authentication, and policy or roster administration.
- Creating or storing claims, uploading documents, and making coverage decisions; these belong to later tickets.

## Acceptance criteria

- [ ] For a valid employee, the covered-people lookup returns the employee and eligible enrolled dependents with identifiers, names, and relationships suitable for selection.
- [ ] The backend accepts the employee or an eligible enrolled dependent as the patient and rejects an unrelated or ineligible patient with a clear, consistent error.
- [ ] The backend selects the policy associated with the employee's company and enrollment that is effective on the treatment date; the client cannot choose the authoritative policy.
- [ ] Unknown employees, invalid enrollments, and dates outside the applicable policy or enrollment period are rejected consistently rather than assigned a guessed policy.
- [ ] A successful resolution provides the policy ID, version, and content hash for later claim creation. The historical policy version can be retrieved and verified using these details.
- [ ] Existing assignment cases using `member_id` identify the employee and default the patient to that employee when no patient is supplied; any fixture policy ID is an expected result, not a client selection.
- [ ] Invalid policy or roster configuration is reported clearly rather than silently producing an incorrect result.

## Verification

- Exercise the covered-people lookup and policy resolution using the supplied data and representative multiple-company and dependent examples.
- Run focused tests for valid and invalid employees and patients, enrollment and policy date boundaries, policy version retrieval, and assignment compatibility.
- Run relevant backend lint and type checks; report unrelated existing failures separately. These checks should not require AI credentials.

## Implementation boundaries

Keep changes focused on backend policy and member resolution, the covered-people lookup, relevant configuration, and focused tests. Use the supplied data and backend specification as references; do not start claim persistence, policy decision logic, or frontend work.
