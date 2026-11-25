# Plum Claims Backend

FastAPI + PostgreSQL + SQLModel backend for the Plum Claims system.

## Requirements

- Python 3.14
- Docker Compose
- `uv` (recommended)

## Setup

From the repository root, copy `.env.example` to `.env` and set a local PostgreSQL password. Keep `.env` uncommitted. Start PostgreSQL:

```powershell
Copy-Item .env.example .env
docker compose up -d
```

Install backend dependencies and start the API:

```powershell
cd backend
uv sync --dev
uv run uvicorn app.main:app --reload
```

The API is available at <http://127.0.0.1:8000>. Without `uv`, install the project with `python -m pip install -e ".[dev]"` and run `python -m uvicorn app.main:app --reload`.

### API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

- `GET /` - basic API response
- `GET /health` - confirms the API process is responding
- `GET /ready` - checks PostgreSQL connectivity; returns `503` if unavailable
- `POST /claims/preview` - validates employee ID, patient name, and treatment date; does not persist data

Interactive API documentation: <http://127.0.0.1:8000/docs>.

## Tests

From `backend/`:

```powershell
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=app

# Run specific test file
uv run pytest tests/test_health.py -v
```
