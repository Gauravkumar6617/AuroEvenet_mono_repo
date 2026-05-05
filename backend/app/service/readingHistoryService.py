from sqlalchemy.orm import Session
from typing import List
from app.repositories.readingHistoryRepositories import ReadingHistoryRepository
from app.models.ReadingHistoryModel import ReadingHistory
from app.schemas.readingHistorySchema import TrackHistoryRequest


class ReadingHistoryService:

    @staticmethod
    def track(
        db: Session, user_id: int, payload: TrackHistoryRequest
    ) -> ReadingHistory:
        return ReadingHistoryRepository.upsert(
            db=db,
            user_id=user_id,
            post_id=payload.post_id,
            duration_seconds=payload.duration_seconds,
            scrolled_to_bottom=payload.scrolled_to_bottom,
            liked=payload.liked,
        )

    @staticmethod
    def get_history(
        db: Session, user_id: int, skip: int, limit: int
    ) -> List[ReadingHistory]:
        return ReadingHistoryRepository.get_by_user(db, user_id, skip, limit)

    @staticmethod
    def remove(db: Session, user_id: int, post_id: int) -> bool:
        return ReadingHistoryRepository.delete(db, user_id, post_id)