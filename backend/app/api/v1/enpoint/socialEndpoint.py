from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.service import follow_service as follow_service
from app.core.dependencies import get_current_user
from app.models.userModel import User

router = APIRouter(prefix="/social", tags=["Social"])

@router.post("/follow/{user_id}", status_code=status.HTTP_200_OK)
def toggle_follow(
    user_id: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Toggles the follow status for a user.
    - current_user_id: Taken from the JWT token.
    - user_id: The ID of the user to follow/unfollow.
    """
    # We no longer pass 'redis' because follow_service uses app.core.cache internally
    return follow_service.handle_toggle_follow(
        db=db, 
        current_user_id=current_user.id, 
        target_id=user_id
    )

@router.get("/stats/{user_id}", status_code=status.HTTP_200_OK)
def get_user_stats(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Fetch follower and following counts.
    """
    return follow_service.get_user_stats(db=db, user_id=user_id)