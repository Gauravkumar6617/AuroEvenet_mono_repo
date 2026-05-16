from multiprocessing import synchronize
from sqlalchemy.orm import Session
from app.models.ReadingHistoryModel import ReadingHistory 
from typing import List, Optional
from datetime import datetime,timedelta


class ReadingHistoryRepository:

####to add user data na dnot present update 
    @staticmethod
    def Upsert(db: Session, user_id: int, post_id: int,duration_seconds: int,scrolled_to_bottom: bool,liked: bool)->ReadingHistory:
        try:
            existing = db.query(ReadingHistory).filter(ReadingHistory.user_id == user_id, ReadingHistory.post_id == post_id).first()
            if existing:
                existing.duration = duration_seconds
                existing.scrolled_to_bottom = scrolled_to_bottom
                existing.liked = liked
                existing.updated_at = datetime.utcnow()
            else:
                existing = ReadingHistory(
                    user_id=user_id,
                    post_id=post_id,
                    duration=duration_seconds,
                    scrolled_to_bottom=scrolled_to_bottom,
                    liked=liked
                )
                db.add(existing)
            db.commit()
            db.refresh(existing)
            return existing
        except Exception as e:
            print(f"Error upserting reading history: {e}")
            return None

    ####to get user data
    @staticmethod
    def GetByUserId(db: Session, user_id: int, skip: int, limit: int=50)->List[ReadingHistory]:
        try:
            return db.query(ReadingHistory).filter(ReadingHistory.user_id == user_id).order_by(ReadingHistory.created_at.desc()).offset(skip).limit(limit).all()
        except Exception as e:
            print(f"Error getting reading history by user id: {e}")
            return {"message":"No Data Found"}
    
    ####to delete user data
    @staticmethod
    def delete(db: Session, user_id: int, post_id: int)->bool:
        try:
            deleted = db.query(ReadingHistory).filter(ReadingHistory.user_id == user_id, ReadingHistory.post_id == post_id).delete(synchronize_session="fetch")
            if deleted:
                db.commit()
                return deleted > 0
            return False
        except Exception as e:
            print(f"Error deleting reading history: {e}")
            return False

    ####to get recently read post ids
    @staticmethod
    def get_recently_read_post_ids(db:Session,user_id:int,hours:int=24)->List[int]:
        try:
           cutoff_time = datetime.utcnow() - timedelta(hours=hours)
           rows=db.query(ReadingHistory.post_id).filter(ReadingHistory.user_id == user_id, ReadingHistory.created_at >= cutoff_time).all()
           return [r.post_id for r in rows]
        except Exception as e:
            print(f"Error getting recently read post ids: {e}")
            return []



        
