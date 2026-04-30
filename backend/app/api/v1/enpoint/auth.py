from fastapi import APIRouter, Depends, HTTPException, status ,Response ,Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.service.AuthService import AuthService 
from app.schemas.userSchema import UserCreate, UserResponse, RegisterResponse, LoginRequest, TokenResponse
from app.repositories.UserRespositories import UserRepository
from app.service.OTPService import OTPService
from pydantic import BaseModel
import redis
from app.core.config import settings
from pydantic import BaseModel
# Initialize Redis client
redis_client = redis.from_url(
    settings.Redis_URL(), 
    decode_responses=True  # This automatically converts Redis bytes to strings
)

router = APIRouter(prefix="/auth", tags=["Auth"])
auth_service = AuthService()
otp_service = OTPService()


# OTP verification schema
class OTPVerifyRequest(BaseModel):
    email: str
    otp: str

class OTPVerifyResponse(BaseModel):
    message: str
    success: bool

@router.post("/register", response_model=RegisterResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    try:
        user, verification_token = auth_service.register_user(db, user_in)
        return RegisterResponse(
            user=user,
            verification_token=verification_token,
            message="Registration successful! Please verify your email."
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login user with email and password"""
    try:
        return auth_service.login_user(db, login_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again."
        )

@router.get("/verify")
def verify_email(token: str, db: Session = Depends(get_db)):
    user_id = redis_client.get(f"verify_email:{token}")
    if not user_id:
        raise HTTPException(400, "Token invalid or expired")
    
    # Logic to flip is_verified to True
    user = UserRepository().get_by_id(int(user_id), db)
    user.is_verified = True
    db.commit()
    redis_client.delete(f"verify_email:{token}")
    return {"msg": "Email verified successfully"}

@router.post("/verify-otp", response_model=OTPVerifyResponse)
def verify_otp(request: OTPVerifyRequest, db: Session = Depends(get_db)):
    """Verify email using OTP code"""
    try:
        # Find user by email
        user = UserRepository().get_by_email(request.email, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify OTP
        if otp_service.verify_otp(user.id, request.otp):
            # Mark user as verified
            user.is_verified = True
            db.commit()
            
            return OTPVerifyResponse(
                message="Email verified successfully! Your account is now active.",
                success=True
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP code"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Verification failed. Please try again."
        )

@router.post("/resend-otp")
def resend_otp(email: str, db: Session = Depends(get_db)):
    """Resend OTP verification code"""
    try:
        # Find user by email
        user = UserRepository().get_by_email(email, db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Send new OTP
        otp = auth_service.email_service.send_otp_email(user.email, user.id)
        if not otp:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send OTP. Please try again."
            )
        
        return {"message": "New OTP code sent to your email", "otp": otp}  # Include OTP for development
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to resend OTP. Please try again."
        )

@router.get("/google/callback")
async def google_callback(
    code: str, 
    request: Request, 
    db: Session = Depends(get_db)
):
    user_agent = request.headers.get("user-agent", "unknown")
    auth_service = AuthService()
    
    try:
        tokens = await auth_service.google_auth(db, code, user_agent)
        
        # Redirect to frontend with tokens
        redirect_url = f"{settings.FRONTEND_URL}/oauth/callback?token={tokens.access_token}&refresh_token={tokens.refresh_token}&email={tokens.email}&username={tokens.username}"
        
        return Response(
            status_code=302,
            headers={"Location": redirect_url}
        )
    except Exception as e:
        # Redirect to frontend with error
        frontend_url = settings.FRONTEND_URL + "/oauth/callback"
        redirect_url = f"{frontend_url}?error=oauth_failed"
        
        return Response(
            status_code=302,
            headers={"Location": redirect_url}
        )


@router.get("/github/callback")
async def github_callback(
    code: str, 
    request: Request, 
    db: Session = Depends(get_db)
):
    user_agent = request.headers.get("user-agent", "unknown")
    auth_service = AuthService()
    
    try:
        tokens = await auth_service.github_auth(db, code, user_agent)
        
        # Redirect to frontend with tokens
        redirect_url = f"{settings.FRONTEND_URL}/oauth/callback?token={tokens.access_token}&refresh_token={tokens.refresh_token}&email={tokens.email}&username={tokens.username}"
        
        return Response(
            status_code=302,
            headers={"Location": redirect_url}
        )
    except Exception as e:
        # Redirect to frontend with error
        frontend_url = settings.FRONTEND_URL + "/oauth/callback"
        redirect_url = f"{frontend_url}?error=oauth_failed"
        
        return Response(
            status_code=302,
            headers={"Location": redirect_url}
        )