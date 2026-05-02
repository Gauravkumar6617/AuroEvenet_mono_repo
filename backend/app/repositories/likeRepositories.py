from sqlalchemy.orm import Session
from app.models.likeModel import Like
from app.schemas.likeScehma import LikeCreate, LikeRead

class LikeRepositorires:
    @staticmethod
    def create_like(db: Session, like: LikeCreate):
        new_like = Like(
            post_id=like.post_id,
            user_id=like.user_id
        )
        db.add(new_like)
        db.commit()
        db.refresh(new_like)
        return new_like
    
    def fetch_all_likes(db: Session):
        return db.query(Like).all()
    
    def fetch_like_by_id(db: Session, like_id: int):
        return db.query(Like).filter(Like.id == like_id).first()
    
    def fetch_like_by_post_id(db: Session, post_id: int):
        return db.query(Like).filter(Like.post_id == post_id).all()
    