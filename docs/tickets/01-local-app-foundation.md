# 01: Establish local app foundation

**What to build:** A developer can start the separated Next.js frontend and FastAPI backend against local PostgreSQL in Docker, verify each is healthy, and run tests without requiring an AI credential.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Backend and frontend are separate runnable projects; frontend uses Next.js, React, TypeScript, and shadcn/ui.
- [ ] Local PostgreSQL starts reproducibly through Docker Compose with development credentials supplied outside committed source.
- [ ] Backend exposes a health/readiness contract and CORS permits the local frontend.
- [ ] Environment configuration has safe documented defaults and an example file without secrets.
- [ ] Focused tests and frontend/backend checks run without OpenAI credentials.
