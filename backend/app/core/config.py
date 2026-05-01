from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import PostgresDsn
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: PostgresDsn
    
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_PASSWORD: str
    REDIS_USERNAME: str

    INTERNAL_API_KEY: str

    JWT_SECRET: str
    JWT_ALGORITHM: str
    JWT_EXPIRATION: int

    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int

    def Redis_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://{self.REDIS_USERNAME}:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"

    APP_MODE: str

    ### Groq AI settings
    GORQ_API_KEY: str

    ### Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    ### Email settings (Gmail SMTP)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = ""
    EMAIL_FROM_NAME: str = "BlogByte"

    ### OAuth
    GOOGLE_REDIRECT_URI: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_REDIRECT_URI: str

    FRONTEND_URL: str = "https://blog-byte-mono-repo.vercel.app"

    model_config = SettingsConfigDict(
        env_file=".env.dev",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )


@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
