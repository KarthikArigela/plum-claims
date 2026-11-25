from http import HTTPStatus

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {"status": "ok"}


def test_ready_when_database_is_available(monkeypatch):
    async def database_is_ready():
        return True

    monkeypatch.setattr("app.main.check_database", database_is_ready)

    response = client.get("/ready")

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {"status": "ready"}


def test_ready_when_database_is_unavailable(monkeypatch):
    async def database_is_unavailable():
        return False

    monkeypatch.setattr("app.main.check_database", database_is_unavailable)

    response = client.get("/ready")

    assert response.status_code == HTTPStatus.SERVICE_UNAVAILABLE
