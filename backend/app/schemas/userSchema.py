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
    role: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    oauth_provider: OAuthProviderEnum = OAuthProviderEnum.NONE
    auth_provider: Optional[str] = None  # Added auth_provider field
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None

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
    id: Optional[int] = None
    email: Optional[str] = None
    username: Optional[str] = None
    role: Optional[str] = None

class RegisterResponse(BaseModel):
    user: UserResponse
    verification_token: Optional[str] = None
    message: str = "Registration successful"

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str


class UserFollowerInfo(BaseModel):
    follower_count:int=0
    followed_count:int=0
    is_following:Optional[bool]=None

