from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.userModel import User
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
@router.get("", response_model=List[ReadingHistoryResponse])
def get_history(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return ReadingHistoryService.get_history(db, user.id, skip, limit)


#remove from history
@router.delete("/{post_id}")
def remove_from_history(
    post_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    ReadingHistoryService.remove(db, user.id, post_id)
    return {"detail": "Removed"}