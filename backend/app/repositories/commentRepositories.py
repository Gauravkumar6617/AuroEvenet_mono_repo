from sqlalchemy.orm import Session
from app.models.commentModel import Comment
from app.schemas.commentScehma import CommentCreate, CommentRead

class CommentRepositorires:
    @staticmethod
    def create_comment(db: Session, comment: CommentCreate):
        new_comment = Comment(
            content=comment.content,
            post_id=comment.post_id,
            user_id=comment.user_id
        )
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        return new_comment
    
    def fetch_all_comments(db: Session):
        return db.query(Comment).all()
    