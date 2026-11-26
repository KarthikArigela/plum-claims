# 01: Establish the local backend foundation

**Goal:** A developer can start the FastAPI backend with local PostgreSQL, verify liveness and database readiness, and run focused checks without AI credentials.

**Blocked by:** None.

**Status:** ready-for-agent

## Scope

- Backend and frontend are separate runnable projects, where Frontend is out of scope until Backend has reached sizable progress.
- Build backend and Docker Compose PostgreSQL service.
- Load local database and frontend-origin settings from environment configuration. Document setup using the existing example environment file; do not commit secrets.
- Add the API split: `GET /health` checks API liveness, and `GET /ready` checks PostgreSQL connectivity. Configure CORS for the local frontend origin without building the frontend.
- Add focused tests and backend setup documentation only as needed to make this slice reproducible.

## Out of scope

- Frontend scaffolding, UI tests, and frontend implementation; these come after backend acceptance.
- Claim persistence, migrations, policy resolution, worker jobs, document processing, and AI integrations; these belong to later tickets.
- Cloud deployment, production authentication, and production infrastructure.

## Acceptance criteria

- [ ] A clean checkout can be configured with local credentials and started using the documented steps; the API and PostgreSQL run independently.
- [ ] `GET /health` returns `200` and `{"status": "ok"}` without requiring a database or AI credential.
- [ ] With PostgreSQL available, `GET /ready` returns `200` and `{"status": "ready"}`; if PostgreSQL is unavailable, it returns `503` without exposing credentials.
- [ ] A browser preflight from the configured local frontend origin is permitted for the existing API methods and headers, without permitting arbitrary origins.
- [ ] Focused backend tests run without AI credentials; no real credentials are committed and the local `.env` remains ignored.

## Verification

- Follow the setup documentation to start the backend and local database, then confirm both health checks report the expected results.
- Run focused tests for database readiness, including an unavailable database, and the local frontend access rules. These checks should not require AI credentials or interrupt a shared database.
- Run the relevant backend lint and type checks; report any unrelated existing failures separately.

## Implementation boundaries

Keep changes focused on the existing backend, local database configuration, tests, and setup documentation. Do not start frontend or later-ticket functionality. Use the backend specification for the agreed architecture and API behavior.
