# 15: Complete evaluation and delivery

**Goal:** A reviewer can reproduce the complete application, understand its design and limitations, and inspect evidence for the assignment's required scenarios.

**Blocked by:** 12a — Verify backend acceptance and evaluation; 13 — Build member submission and tracking UI; 14 — Build operations review UI.

**Status:** ready-for-agent

## Scope

- Update the backend evaluation with final application results and deliver the assignment's architecture, component contracts, setup, and evaluation documentation.
- Verify the member and operations flows together and prepare the requested demo video.
- Provide credential-free automated checks and explain privacy, security, and scaling limitations.

## Out of scope

- Production deployment, real authentication, compliance certification, and real patient data.
- Presenting mocked evaluation as measured live-model performance.

## Acceptance criteria

- [ ] All 12 assignment cases have a final report showing expected and produced behavior, the relevant full trace, match result, and an explanation of any mismatch or unverified result. Mocked and live results are clearly distinguished.
- [ ] Representative synthetic PDFs and images cover document types, mixed pages, and quality variations; live model evaluation is opt-in.
- [ ] Clean-checkout instructions reproduce local PostgreSQL, backend, worker, and frontend startup and the main member and operations flows.
- [ ] Architecture and component contracts reflect the actual system, interfaces, error behavior, trade-offs, limitations, and a measured or explicitly proposed scale-up path.
- [ ] CI runs backend tests, lint, type and migration checks, plus frontend tests, lint, type and build checks without external AI credentials.
- [ ] Documentation states that data is synthetic or assignment-provided, reviewer identity is unverified, and the demo makes no production privacy or compliance claim. Committed artifacts contain no secrets or real member health information.
- [ ] An 8–12 minute demo video covers a specific early document stop, a successful approval with its trace, and one technical decision to keep and one to change.

## Verification

- Follow the clean-checkout setup and demonstrate the required member and operations flows.
- Run the evaluation and automated checks; review the report, delivery documents, and demo against the assignment, recording any gaps.
- Confirm ordinary checks work without AI credentials and any optional live evaluation is clearly identified.

## Implementation boundaries

Keep changes focused on final evaluation, delivery documentation, automated checks, and demo preparation. Reuse the backend acceptance evidence from ticket 12a and update it where the completed application provides new evidence.
