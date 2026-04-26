import uuid
from sqlalchemy.orm import Session
from app.models.userModel import User
from app.repositories.UserRespositories import UserRepository
from app.core.security import hashed_password, verify_password, create_access_token
from app.schemas.userSchema import UserCreate, LoginRequest, TokenResponse
from app.core.config import settings
from app.service.EmailService import EmailService
import redis
r = redis.from_url(
    settings.Redis_URL(), 
    decode_responses=True  # This automatically converts Redis bytes to strings
)


class AuthService:

    def __init__(self):
        self.user_repo = UserRepository()
        self.email_service = EmailService()

    def register_user(self, db: Session, user_create: UserCreate) -> User:
        # Check if email already exists
        existing_user = self.user_repo.get_by_email(user_create.email, db)
        if existing_user:
            raise ValueError("Email already registered")

        # Hash the password
        hashed_pwd = hashed_password(user_create.password)

        # Create the user in the database
        new_user = self.user_repo.create_user(user_create, hashed_pwd, db)
        v_token = str(uuid.uuid4())
        r.setex(f"verify_email:{v_token}", 3600, new_user.id)

        # Send OTP verification email
        otp = self.email_service.send_otp_email(new_user.email, new_user.id)
        if not otp:
            # Log warning but don't fail registration
            print(f"Warning: Failed to send OTP email to {new_user.email}")
            # Fallback to token method
            email_sent = self.email_service.send_verification_email(new_user.email, v_token)
            return new_user, v_token

        return new_user, otp

    def login_user(self, db: Session, login_req: LoginRequest) -> TokenResponse:
        user = self.user_repo.get_by_email(login_req.email, db)
        if not user or not verify_password(login_req.password, user.password_hash):
            raise ValueError("Invalid email or password")

        tokens = create_access_token(user.id, login_req.user_Agent)
        return TokenResponse(**tokens)