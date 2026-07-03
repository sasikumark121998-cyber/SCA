"""Configuration and environment variables."""
from pydantic import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:pass@localhost:5432/dbname"
    SECRET_KEY: str = "replace-me"

    class Config:
        env_file = ".env"


settings = Settings()
