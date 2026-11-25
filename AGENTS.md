# AGENTS.md — Plum Claims

## Project Context
- Repository: `plum-claims` (Health Insurance AI Claims Processing System).
- Primary reference docs: `docs/CLAIMS_SYSTEM_SPEC.md`, `docs/BACKEND_SPEC.md`, and active tickets in `docs/tickets/`.
- Dependency & tooling source of truth: `backend/pyproject.toml` (Python `>=3.14`, FastAPI, SQLModel, `asyncpg`, Alembic, Pydantic v2, `httpx`, `openai`, LangGraph + Postgres checkpointer, `pymupdf`, `pillow`; dev tools: `pytest`, `pytest-asyncio`, `ruff`, `mypy`).

## How We Work (Control + Speed)
- Work on **one ticket or one narrow slice at a time**. Do not jump ahead to later tickets or unrequested features.
- Before making edits on a non-trivial step, briefly state which files will be touched, why each change is needed, and any simpler alternatives considered.
- Pause after completing the requested slice and running narrow verification so I can review `git diff` and ask questions.

## Anti-Bloat & Scope Rules
- Modify or create **only** the files explicitly required for the current ticket/slice.
- Do **not** create extra modules, helper classes, wrapper layers, config flags, or speculative error handling unless asked.
- Do **not** create empty `__init__.py` placeholder files unless explicitly requested.
- Do **not** edit unrelated files, refactor untouched code, or change formatting in unaffected areas.
- Prefer straightforward, readable code over clever abstractions or premature optimization.

## Data, Config & Security Rules
- Never hardcode secrets, API keys, or real credentials in source files; load environment config cleanly and keep `.env` out of version control.
- Never log raw documents, PHI/medical details, or sensitive payloads.
- Keep deterministic business/policy/eligibility logic in backend code rather than letting LLMs decide policy outcomes.

## Verification
- After edits, run the narrowest relevant checks from `backend/` (`ruff check`, `mypy`, and targeted `pytest`).
- End every response with a concise summary:
  1. Files changed/created
  2. Why each change was necessary
  3. Exact verification commands run and their results