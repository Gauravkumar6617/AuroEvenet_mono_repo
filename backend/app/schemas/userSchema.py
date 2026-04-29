from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum

class OAuthProviderEnum(str, Enum):
    GOOGLE = "google"
    GITHUB = "github"
    APPLE = "apple"
    NONE = "none"

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=2, max_length=100)

class UserCreate(UserBase):
    # Password is optional for OAuth users, but required for standard registration
    password: Optional[str] = Field(None, min_length=8)
    oauth_provider: OAuthProviderEnum = OAuthProviderEnum.NONE
    oauth_id: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool = True
    is_verified: bool = False
    oauth_provider: OAuthProviderEnum = OAuthProviderEnum.NONE

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    user_Agent: str = "web-app"

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    message: str = "Login successful"

class RegisterResponse(BaseModel):
    user: UserResponse
    verification_token: Optional[str] = None
    message: str = "Registration successful"