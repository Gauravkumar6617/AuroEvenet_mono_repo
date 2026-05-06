from fastapi import APIRouter, Depends, HTTPException, status ,Response ,Request ,Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.service.AuthService import AuthService 
from app.schemas.userSchema import UserCreate, UserResponse, RegisterResponse, LoginRequest, TokenResponse ,ForgotPasswordRequest ,ResetPasswordRequest
from app.repositories.UserRespositories import UserRepository
from app.service.OTPService import OTPService
from pydantic import BaseModel
import logging
import redis
from urllib.parse import urlencode, quote_plus
from app.core.config import settings
# Initialize Redis client
redis_client = redis.from_url(
    settings.Redis_URL(), 
    decode_responses=True  # This automatically converts Redis bytes to strings
)

router = APIRouter(prefix="/auth", tags=["Auth"])
auth_service = AuthService()
otp_service = OTPService()
logger = logging.getLogger(__name__)


def _cookie_policy(request: Request) -> tuple[bool, str]:
    """
    Use cross-site compatible cookie settings on HTTPS:
    - SameSite=None + Secure for frontend/API on different domains.
    - SameSite=Lax + non-secure fallback for local http development.
    """
    is_https = request.url.scheme == "https"
    return is_https, "none" if is_https else "lax"


def _safe_error_detail(exc: Exception) -> str:
    raw = str(exc).strip() or "oauth_failed"
    return raw[:180]


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
def login(login_data: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    """Login user with email and password"""
    try:
        tokens = auth_service.login_user(db, login_data)
        secure_cookie, samesite_policy = _cookie_policy(request)
        logger.info(
            "Password login setting auth cookies secure=%s samesite=%s origin=%s",
            secure_cookie,
            samesite_policy,
            request.headers.get("origin"),
        )
        
        # Set access token in HttpOnly cookie
        response.set_cookie(
            key="access_token",
            value=tokens.access_token,
            httponly=True,
            secure=secure_cookie,
            samesite=samesite_policy,
            max_age=3600  # 1 hour
        )
        
        # Set refresh token in HttpOnly cookie
        response.set_cookie(
            key="refresh_token",
            value=tokens.refresh_token,
            httponly=True,
            secure=secure_cookie,
            samesite=samesite_policy,
            max_age=604800  # 7 days
        )
        
        return tokens
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again."
        )

@router.post("/logout")
def logout(response: Response):
    """Clear auth cookies"""
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}




####to identify myself


@router.get("/check-username")
def check_username(username:str=Query(... , min_length=3, max_length=50), db: Session = Depends(get_db)):
    """Check if username exists"""

    #clean the inputt
    username = username.strip().lower()
    cache_key = f"username:{username}"
    is_available = False

    #now get username from cache
    try:
        cache_value = redis_client.get(cache_key)
        if cache_value is not None:
            return {
                "available": cache_value =="true",
                "source": "cache"
            }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check username availability"
        )

    user_repo = UserRepository()
    user = user_repo.get_by_username(username, db)
    is_available = user is None
    
    # 4. Update Cache (Store for 5 minutes)
    try:
        redis_client.setex(cache_key, 300, str(is_available).lower())
    except Exception as e:
        logging.error(f"Redis Save Error: {e}")

    return {
        "available": is_available,
        "source": "database"
    }

##### tofor reset password
@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest, 
    db: Session = Depends(get_db)
):
    """Step 1: User submits email to get an OTP"""
    otp_service = OTPService()
    AuthService.process_forgot_password(db, data.email, redis_client, otp_service)
    
    return {"message": "If an account exists with this email, an OTP has been sent."}


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest, 
    db: Session = Depends(get_db)
):
    """Step 2: User submits OTP and new password"""
    success = AuthService.process_reset_password(
        db, data.email, data.otp, data.new_password, redis_client
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
        
    return {"message": "Password reset successful. You can now login with your new password."}
@router.get("/me", response_model=UserResponse)
def get_me(request: Request, db: Session = Depends(get_db)):
    """Get current user info from cookie"""
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_agent = request.headers.get("user-agent", "unknown")
    from app.core.security import verify_token
    user_id = verify_token(token, user_agent)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
        
    user = UserRepository().get_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/google/login")
async def google_login():
    """Redirect user to Google OAuth login page"""
    google_client_id = settings.GOOGLE_CLIENT_ID
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    
    if not google_client_id:
        logger.error("Google OAuth login requested but client ID is not configured")
        raise HTTPException(status_code=500, detail="Google OAuth not configured")

    query = urlencode(
        {
            "client_id": google_client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "select_account",
            "state": "google",
        }
    )
    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{query}"
    logger.info("Google OAuth login redirect generated with redirect_uri=%s", redirect_uri)
    
    return Response(status_code=302, headers={"Location": google_auth_url})

@router.get("/google/callback")
async def google_callback(
    code: str, 
    request: Request, 
    response: Response,
    db: Session = Depends(get_db)
):
    user_agent = request.headers.get("user-agent", "unknown")
    auth_service = AuthService()
    secure_cookie, samesite_policy = _cookie_policy(request)
    logger.info(
        "Google callback received code_length=%s state=%s redirect_target=%s",
        len(code) if code else 0,
        request.query_params.get("state"),
        settings.FRONTEND_URL + "/oauth/callback?provider=google",
    )
    
    try:
        tokens = await auth_service.google_auth(db, code, user_agent)
        
        # Redirect to frontend
        redirect_response = Response(status_code=302, headers={"Location": settings.FRONTEND_URL + "/oauth/callback?provider=google"})
        
        # Set cookies on the redirect response
        redirect_response.set_cookie(
            key="access_token",
            value=tokens.access_token,
            httponly=True,
            secure=secure_cookie,
            samesite=samesite_policy,
        )
        redirect_response.set_cookie(
            key="refresh_token",
            value=tokens.refresh_token,
            httponly=True,
            secure=secure_cookie,
            samesite=samesite_policy,
        )
        logger.info(
            "Google callback set cookies secure=%s samesite=%s",
            secure_cookie,
            samesite_policy,
        )
        
        return redirect_response
    except Exception as e:
        logger.exception("Google OAuth callback failed: %s", str(e))
        detail = quote_plus(_safe_error_detail(e))
        return Response(
            status_code=302,
            headers={
                "Location": f"{settings.FRONTEND_URL}/oauth/callback?error=oauth_failed&provider=google&error_detail={detail}"
            },
        )


@router.get("/github/login")
async def github_login():
    """Redirect user to GitHub OAuth login page"""
    github_client_id = settings.GITHUB_CLIENT_ID
    redirect_uri = settings.GITHUB_REDIRECT_URI
    
    if not github_client_id:
        logger.error("GitHub OAuth login requested but client ID is not configured")
        raise HTTPException(status_code=500, detail="GitHub OAuth not configured")

    query = urlencode(
        {
            "client_id": github_client_id,
            "redirect_uri": redirect_uri,
            "scope": "user:email",
            "state": "github",
        }
    )
    github_auth_url = f"https://github.com/login/oauth/authorize?{query}"
    logger.info("GitHub OAuth login redirect generated with redirect_uri=%s", redirect_uri)
    
    return Response(status_code=302, headers={"Location": github_auth_url})

@router.get("/github/callback")
async def github_callback(
    code: str, 
    request: Request, 
    response: Response,
    db: Session = Depends(get_db)
):
    user_agent = request.headers.get("user-agent", "unknown")
    auth_service = AuthService()
    secure_cookie, samesite_policy = _cookie_policy(request)
    logger.info(
        "GitHub callback received code_length=%s state=%s redirect_target=%s",
        len(code) if code else 0,
        request.query_params.get("state"),
        settings.FRONTEND_URL + "/oauth/callback?provider=github",
    )
    
    try:
        tokens = await auth_service.github_auth(db, code, user_agent)
        
        # Redirect to frontend
        redirect_response = Response(status_code=302, headers={"Location": settings.FRONTEND_URL + "/oauth/callback?provider=github"})
        
        # Set cookies on the redirect response
        redirect_response.set_cookie(
            key="access_token",
            value=tokens.access_token,
            httponly=True,
            secure=secure_cookie,
            samesite=samesite_policy,
        )
        redirect_response.set_cookie(
            key="refresh_token",
            value=tokens.refresh_token,
            httponly=True,
            secure=secure_cookie,
            samesite=samesite_policy,
        )
        logger.info(
            "GitHub callback set cookies secure=%s samesite=%s",
            secure_cookie,
            samesite_policy,
        )
        
        return redirect_response
    except Exception as e:
        logger.exception("GitHub OAuth callback failed: %s", str(e))
        detail = quote_plus(_safe_error_detail(e))
        return Response(
            status_code=302,
            headers={
                "Location": f"{settings.FRONTEND_URL}/oauth/callback?error=oauth_failed&provider=github&error_detail={detail}"
            },
        )




