from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

REPOSITORY_ROOT = Path(__file__).resolve().parents[2]

class Settings(BaseSettings):
    frontend_origin: str = "http://localhost:3000"
    postgres_host: str = "127.0.0.1"
    postgres_port: int = 5432
    postgres_user: str | None = None
    postgres_password: str | None = None
    postgres_db: str | None = None

    model_config = SettingsConfigDict(
        env_file=REPOSITORY_ROOT / ".env",
        extra="ignore",
    )


settings =  Settings()
