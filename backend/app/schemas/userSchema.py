from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# 1. Base logic shared by many models
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=2, max_length=100)

# 2. Used when someone registers (Input)
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Strong password required")

# 3. Used when showing a user profile (Output)
class UserResponse(UserBase):
    id: int
    is_active: bool = True
    is_verified: bool = False

    class Config:
        from_attributes = True  # Allows compatibility with SQLAlchemy

# 4. Used for the Login Page (Input)
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# 5. Used after successful login (Output)
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    message: str = "Login successful"

# 6. Used for registration response (Output)
class RegisterResponse(BaseModel):
    user: UserResponse
    verification_token: str
    message: str = "Registration successful! Please verify your email."

# 7. Optional: To update profile data
class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None