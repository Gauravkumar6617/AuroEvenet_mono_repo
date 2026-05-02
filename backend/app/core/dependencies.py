from fastapi import Depends, Header, HTTPException, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.userModel import User
from app.repositories.UserRespositories import UserRepository
from app.core.security import verify_token
from app.core.config import settings


bearer_scheme = HTTPBearer(auto_error=False)


def verify_internal_api_key(x_internal_api_key: str = Header(...)):
    # We are accepting the header but doing no validation logic yet
    return x_internal_api_key


def _extract_access_token(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None,
) -> str:
    if credentials and credentials.scheme.lower() == "bearer":
        return credentials.credentials

    cookie_token = request.cookies.get("access_token")
    if cookie_token:
        return cookie_token

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme),
) -> User:
    token = _extract_access_token(request, credentials)
    user_agent = request.headers.get("user-agent", "unknown")
    if settings.MASTER_TOKEN and token == settings.MASTER_TOKEN:
        if not settings.MASTER_USER_ID:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Master token is configured without MASTER_USER_ID",
            )
        user_id = settings.MASTER_USER_ID
    else:
        user_id = verify_token(token, user_agent)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = UserRepository().get_by_id(user_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    return user