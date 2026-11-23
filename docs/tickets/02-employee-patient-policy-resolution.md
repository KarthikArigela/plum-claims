# 02: Resolve employee, patient, and policy

**What to build:** A member can identify an employee, see that employee and eligible dependents, select the treated patient, and have the backend resolve the correct policy version for the treatment date.

**Blocked by:** 01 — Establish local app foundation.

**Status:** ready-for-agent

- [ ] Backend validates and loads versioned policy/company/roster JSON through a policy-catalog boundary.
- [ ] Covered-people lookup returns displayable self/dependent choices for a valid employee ID.
- [ ] Claim context resolves the employee enrollment and policy effective on treatment date; client cannot supply the authoritative policy choice.
- [ ] Selected patient must be self or an eligible enrolled dependent; invalid employee, patient, enrollment, and effective-date cases fail deterministically.
- [ ] Resolved policy ID, version, and content hash are available to claim creation without copying policy terms into the claim.
- [ ] Existing assignment cases using `member_id` map to employee identity and default patient to employee.
- [ ] Tests cover supplied roster, multiple-company/policy fixtures, treatment-date boundaries, and dependent eligibility.
