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
    
    def fetch_like_by_user_and_post(db: Session, user_id: int, post_id: int):
        return db.query(Like).filter(Like.user_id == user_id, Like.post_id == post_id).first()
    
    def delete_like(db: Session, like_id: int):
        like = db.query(Like).filter(Like.id == like_id).first()
        if like:
            db.delete(like)
            db.commit()
        return like
    
    def toggle_like(db: Session, user_id: int, post_id: int):
        existing_like = db.query(Like).filter(Like.user_id == user_id, Like.post_id == post_id).first()
        if existing_like:
            db.delete(existing_like)
            db.commit()
            return None
        else:
            new_like = Like(user_id=user_id, post_id=post_id)
            db.add(new_like)
            db.commit()
            db.refresh(new_like)
            return new_like
    
    def get_like_count_for_post(db: Session, post_id: int):
        return db.query(Like).filter(Like.post_id == post_id).count()
    