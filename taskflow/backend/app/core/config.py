from pydantic_settings import BaseSettings
from pathlib import Path
from pydantic import Field


# Reads environment variables with pydantic-settings
class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = Field(min_length=32, max_length=128)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    PORT: int = 8000
    SQL_ECHO: bool = False
    SQL_PRE_PING: bool = False
    SQL_POOL_SIZE: int = 5
    SQL_MAX_OVERFLOW: int = 10
    SQL_POOL_RECYCLE: int = 1800
    REDIS_URL: str = "redis"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_DECODE_RESPONSES: bool = True

    class Config:
        env_file = Path(__file__).parent.parent.parent.parent / ".env"


settings = Settings()
