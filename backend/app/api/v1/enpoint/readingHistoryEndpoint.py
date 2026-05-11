from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.userModel import User
from app.models.ReadingHistoryModel import ReadingHistory
from app.models.postModel import Post
from app.schemas.readingHistorySchema import TrackHistoryRequest, ReadingHistoryResponse
from app.service.readingHistoryService import ReadingHistoryService

router = APIRouter(prefix="/history", tags=["Reading History"])


#track reading
@router.post("", status_code=status.HTTP_201_CREATED)
def track_reading(
    payload: TrackHistoryRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ReadingHistoryService.track(db, user.id, payload)
    return {"detail": "Tracked"}


####get user history reading
@router.get("")
def get_history(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    rows = (
        db.query(ReadingHistory)
        .options(joinedload(ReadingHistory.post).joinedload(Post.author))
        .filter(ReadingHistory.user_id == user.id)
        .order_by(ReadingHistory.created_at.desc())
        .offset(skip).limit(limit)
        .all()
    )
    return [
        {
            "id": r.id,
            "post_id": r.post_id,
            "post_title": r.post.title if r.post else None,
            "post_slug": r.post.slug if r.post else None,
            "author_name": r.post.author.username if r.post and r.post.author else None,
            "duration_seconds": r.duration,
            "created_at": r.created_at,
        }
        for r in rows
    ]


#remove from history
@router.delete("/{post_id}")
def remove_from_history(
    post_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ReadingHistoryService.remove(db, user.id, post_id)
    return {"detail": "Removed"}