import uuid
import httpx
import redis
import traceback
import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.userModel import User
from app.repositories.UserRespositories import UserRepository
from app.core.security import hashed_password, verify_password, create_access_token
from app.schemas.userSchema import UserCreate, LoginRequest, TokenResponse
from app.models.models_enum import AuthProvider
from app.core.config import settings
from app.service.EmailService import EmailService

# Initialize Redis
r = redis.from_url(
    settings.Redis_URL(), 
    decode_responses=True
)
logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()
        self.email_service = EmailService()

    # --- STANDARD REGISTRATION ---
    def register_user(self, db: Session, user_create: UserCreate):
        existing_user = self.user_repo.get_by_email(user_create.email, db)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Hash password only if it exists (Standard users)
        pwd_hash = hashed_password(user_create.password) if user_create.password else None

        # Create user
        new_user = self.user_repo.create_user(user_create, pwd_hash, db)
        
        # Redis Token for verification link backup
        v_token = str(uuid.uuid4())
        r.setex(f"verify_email:{v_token}", 3600, str(new_user.id))

        # OTP Logic
        otp = self.email_service.send_otp_email(new_user.email, new_user.id)
        if not otp:
            self.email_service.send_verification_email(new_user.email, v_token)
            return new_user, v_token

        return new_user, otp

    # --- STANDARD LOGIN ---
    def login_user(self, db: Session, login_req: LoginRequest) -> TokenResponse:
        try:
            user = self.user_repo.get_by_email(login_req.email, db)
            if not user or not user.password_hash: # Check for social users trying to login via pwd
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            if not verify_password(login_req.password, user.password_hash):
                raise HTTPException(status_code=401, detail="Invalid email or password")

            # Access and Refresh tokens
            tokens = create_access_token(user.id, login_req.user_Agent)
            
            # Store session in Redis for Logout/Revocation support
            r.setex(f"session:{user.id}", 604800, tokens["refresh_token"])
            
            return TokenResponse(**tokens)
        except Exception as e:
            logger.exception("login_user failed: %s", str(e))
            traceback.print_exc()
            raise
    
    # --- GOOGLE OAUTH LOGIC ---
    async def google_auth(self, db: Session, code: str, user_agent: str):
        try:
            async with httpx.AsyncClient() as client:
                # 1. Exchange Auth Code for Access Token
                token_url = "https://oauth2.googleapis.com/token"
                token_data = {
                    "code": code,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                    "grant_type": "authorization_code",
                }
                logger.info(
                    "Google token exchange started with redirect_uri=%s code_length=%s",
                    settings.GOOGLE_REDIRECT_URI,
                    len(code) if code else 0,
                )
                token_res = await client.post(token_url, data=token_data)
                if token_res.status_code != 200:
                    logger.error("Google token exchange failed status=%s body=%s", token_res.status_code, token_res.text)
                    raise HTTPException(status_code=400, detail="Failed to retrieve token from Google")
                
                access_token = token_res.json().get("access_token")

                # 2. Get User Info from Google
                user_info_res = await client.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                google_info = user_info_res.json() # Contains 'email', 'sub', 'name'
                logger.info(
                    "Google user info fetched email=%s subject=%s",
                    google_info.get("email"),
                    google_info.get("sub"),
                )

            # 3. Sync with local database
            user = self.user_repo.get_by_email(google_info["email"], db)
            
            if not user:
                # Create user automatically as 'verified' since Google trusts them
                user_data = UserCreate(
                    email=google_info["email"],
                    username=google_info.get("name", google_info["email"]),
                    password=None,
                    oauth_provider=AuthProvider.GOOGLE,
                    oauth_id=google_info["sub"]
                )
                user = self.user_repo.create_user(user_data, None, db)
                user.is_verified = True
                db.commit()

            logger.info("Google auth completed for email=%s username=%s", user.email, user.username)
            # 4. Generate internal tokens
            tokens = create_access_token(user.id, user_agent)
            r.setex(f"session:{user.id}", 604800, tokens["refresh_token"])
            
            return TokenResponse(
                access_token=tokens["access_token"],
                refresh_token=tokens["refresh_token"],
                email=user.email,
                username=user.username
            )
        except Exception as e:
            logger.exception("google_auth failed: %s", str(e))
            traceback.print_exc()
            raise
    

    async def github_auth(self, db: Session, code: str, user_agent: str):
        try:
            async with httpx.AsyncClient() as client:
                # 1. Exchange code for Access Token
                # GitHub returns results as query params or JSON based on 'Accept' header
                token_res = await client.post(
                    "https://github.com/login/oauth/access_token",
                    data={
                        "client_id": settings.GITHUB_CLIENT_ID,
                        "client_secret": settings.GITHUB_CLIENT_SECRET,
                        "code": code,
                        "redirect_uri": settings.GITHUB_REDIRECT_URI,
                    },
                    headers={"Accept": "application/json"}
                )
                logger.info(
                    "GitHub token exchange started with redirect_uri=%s code_length=%s",
                    settings.GITHUB_REDIRECT_URI,
                    len(code) if code else 0,
                )
                token_data = token_res.json()
                access_token = token_data.get("access_token")

                if not access_token:
                    logger.error("GitHub token exchange failed status=%s body=%s", token_res.status_code, token_res.text)
                    raise HTTPException(status_code=400, detail="Failed to get GitHub token")

                # 2. Get User Profile
                user_res = await client.get(
                    "https://api.github.com/user",
                    headers={"Authorization": f"token {access_token}"}
                )
                github_user = user_res.json()
                logger.info(
                    "GitHub user info fetched login=%s id=%s email=%s",
                    github_user.get("login"),
                    github_user.get("id"),
                    github_user.get("email"),
                )

                # 3. Get User Email (GitHub sometimes hides email in the profile call)
                if not github_user.get("email"):
                    email_res = await client.get(
                        "https://api.github.com/user/emails",
                        headers={"Authorization": f"token {access_token}"}
                    )
                    # Find the primary, verified email
                    emails = email_res.json()
                    primary_email = next((e["email"] for e in emails if e["primary"]), emails[0]["email"])
                    github_user["email"] = primary_email

            # 4. Sync with Database
            user = self.user_repo.get_by_email(github_user["email"], db)
            
            if not user:
                # Create user automatically
                user_data = UserCreate(
                    email=github_user["email"],
                    username=github_user.get("login", github_user["email"]), # GitHub uses 'login' for username
                    password=None,
                    oauth_provider=AuthProvider.GITHUB,
                    oauth_id=str(github_user["id"])
                )
                user = self.user_repo.create_user(user_data, None, db)
                user.is_verified = True
                db.commit()

            logger.info("GitHub auth completed for email=%s username=%s", user.email, user.username)
            # 5. Generate internal tokens
            tokens = create_access_token(user.id, user_agent)
            r.setex(f"session:{user.id}", 604800, tokens["refresh_token"])
            
            return TokenResponse(
                access_token=tokens["access_token"],
                refresh_token=tokens["refresh_token"],
                email=user.email,
                username=user.username
            )
        except Exception as e:
            logger.exception("github_auth failed: %s", str(e))
            traceback.print_exc()
            raise