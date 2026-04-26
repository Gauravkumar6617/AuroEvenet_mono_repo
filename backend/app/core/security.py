import jwt
import uuid
import hashlib
import redis
from datetime import datetime, timedelta, timezone
from typing import Optional
import bcrypt

# Import my settings instance
from app.core.config import settings 

# 1. INITIALIZE REDIS (This fixes the 'r is not defined' error)
# We use settings.Redis_URL() which you defined in my Pydantic class
r = redis.from_url(
    settings.Redis_URL(), 
    decode_responses=True  # This automatically converts Redis bytes to strings
)

def hashed_password(password: str) -> str:
    # Truncate password to 72 bytes to avoid bcrypt limitation
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    # Generate salt and hash
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Truncate password to 72 bytes to avoid bcrypt limitation
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def create_access_token(user_id: int, user_Agent: str):
    now = datetime.now(timezone.utc)

    # Unique session ID
    jti = str(uuid.uuid4())[:8]
    redis_key = f"s:{user_id}"

    
    # ACCESS_TOKEN_EXPIRE_MINUTES,
    r.setex(redis_key, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS), jti)

    fingerprint = hashlib.sha256(user_Agent.encode()).hexdigest()

    acc_payload = {
        "sub": str(user_id),
        "jti": jti,
        "dev": fingerprint,
        "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    ref_payload = {
        "sub": str(user_id),
        "jti": jti,
        # Refresh tokens usually don't need 'dev' fingerprinting, but it's okay to keep
        "exp": now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    }

    return {
        "access_token": jwt.encode(acc_payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM),
        "refresh_token": jwt.encode(ref_payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    }

def verify_token(token: str, user_Agent: str) -> Optional[int]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id = int(payload.get("sub"))
        jti = payload.get("jti")
        fingerprint = payload.get("dev")

        # 1. Device check
        if fingerprint and fingerprint != hashlib.sha256(user_Agent.encode()).hexdigest():
            return None

        # 2. Redis Session check
        redis_key = f"s:{user_id}"
        stored_jti = r.get(redis_key)
        
        # Because of decode_responses=True, we don't need .decode()
        if stored_jti is None or stored_jti != jti:
            return None

        return user_id
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def revoke_token(user_id: int):
    # This kills the session for this user globally
    r.delete(f"s:{user_id}")