from pydantic_settings import BaseSettings ,SettingsConfigDict
from pydantic import PostgresDsn ,field_validator
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: PostgresDsn
    
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_PASSWORD: str
    REDIS_USERNAME: str

    INTERNAL_API_KEY: str  # This is the new field for the internal API key for internal service communication

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


    ### Gorq AI settings
    GORQ_API_KEY: str


    ### cloudinary api key 

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    # Email settings for development (in production, use proper SMTP)
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 1025
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@blogbyte.com"
    EMAIL_FROM_NAME: str = "BlogByte"


    ###OAuth
    GOOGLE_REDIRECT_URI:str
    GOOGLE_CLIENT_ID:str
    GOOGLE_CLIENT_SECRET:str
    GITHUB_CLIENT_ID:str
    GITHUB_CLIENT_SECRET:str
    FRONTEND_URL: str = "http://localhost:5173"

    model_config=SettingsConfigDict(env_file=".env.dev", env_file_encoding="utf-8", case_sensitive=False ,extra="ignore")


@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()