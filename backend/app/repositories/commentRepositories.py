from sqlalchemy.orm import Session
from app.models.commentModel import Comment
from app.schemas.commentScehma import CommentCreate, CommentRead
from app.core.cache import cache_get_json, cache_set_json

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
    
    @staticmethod
    def fetch_all_comments(db: Session):
        cache_key = "comments:all"
        cached_data = cache_get_json(cache_key)
        if cached_data:
            return [Comment(**comment) for comment in cached_data]

        comments = db.query(Comment).all()
        if comments:
            cache_set_json(cache_key, [comment.__dict__ for comment in comments], ttl_seconds=3600)
        return comments
