from sqlalchemy.orm import Session
from typing import List
from app.models.postModel import Post
from app.models.commentModel import Comment
from app.models.userInterestModel import UserInterest  # adjust import to your actual path
from app.models.tagModel import Tag                    # adjust import to your actual path


class AiRepository:

    @staticmethod
    def get_comment_texts(db: Session, post_id: int) -> List[str]:
        return [
            c.content
            for c in db.query(Comment)
            .filter(Comment.post_id == post_id)
            .all()
        ]

    @staticmethod
    def get_post(db: Session, post_id: int) -> Post | None:
        return db.query(Post).filter(Post.id == post_id).first()

    @staticmethod
    def get_user_interests(db: Session, user_id: int) -> List[UserInterest]:
        return db.query(UserInterest).filter(UserInterest.user_id == user_id).all()

    @staticmethod
    def get_tag_by_id(db: Session, tag_id: int) -> Tag | None:
        return db.query(Tag).filter(Tag.id == tag_id).first()

    @staticmethod
    def upsert_user_interest(
        db: Session, user_id: int, tag_id: int, weight: float
    ) -> None:
        existing = (
            db.query(UserInterest)
            .filter(UserInterest.user_id == user_id, UserInterest.tag_id == tag_id)
            .first()
        )
        if existing:
            existing.score = weight
        else:
            db.add(UserInterest(user_id=user_id, tag_id=tag_id, score=weight))
        db.commit()

    @staticmethod
    def delete_user_interest(db: Session, user_id: int, tag_id: int) -> bool:
        deleted = (
            db.query(UserInterest)
            .filter(UserInterest.user_id == user_id, UserInterest.tag_id == tag_id)
            .delete(synchronize_session="fetch")
        )
        db.commit()
        return deleted > 0