from typing import Optional

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.service import follow_service as follow_service
from app.core.dependencies import get_current_user, get_optional_user
from app.models.userModel import User, user_follower

router = APIRouter(prefix="/social", tags=["Social"])

@router.post("/follow/{user_id}", status_code=status.HTTP_200_OK)
def toggle_follow(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    return follow_service.get_user_stats(db=db, user_id=user_id)

@router.get("/followers/{user_id}")
def get_followers(
    user_id: int,
    db: Session = Depends(get_db)
):
    rows = db.query(user_follower).filter(user_follower.c.followed_id == user_id).all()
    follower_ids = [r.follower_id for r in rows]
    users = db.query(User).filter(User.id.in_(follower_ids)).all()
    return [{"id": u.id, "username": u.username, "avatar_url": u.avatar_url} for u in users]

@router.get("/following/{user_id}")
def get_following(
    user_id: int,
    db: Session = Depends(get_db)
):
    rows = db.query(user_follower).filter(user_follower.c.follower_id == user_id).all()
    following_ids = [r.followed_id for r in rows]
    users = db.query(User).filter(User.id.in_(following_ids)).all()
    return [{"id": u.id, "username": u.username, "avatar_url": u.avatar_url} for u in users]

@router.get("/is-following/{target_id}")
def is_following(
    target_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    if current_user is None:
        return {"is_following": False}

    row = db.query(user_follower).filter(
        user_follower.c.follower_id == current_user.id,
        user_follower.c.followed_id == target_id
    ).first()
    return {"is_following": row is not None}
