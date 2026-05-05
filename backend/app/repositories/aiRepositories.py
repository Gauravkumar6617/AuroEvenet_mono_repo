from sqlalchemy.orm import Session
from typing import List
from app.models.postModel import Post
from app.models.tagModel import Tag
from app.models.userInterestModel import UserInterest
from app.models.commentModel import Comment

class AiRepositorires:
    @staticmethod
    def get_comments_text(db: Session, post_id: int)->List[str]:
        try:
          return [ c.content for c in db.query(Comment).filter(Comment.post_id == post_id).all()]
        except Exception as e:
            print(f"Error getting comments text: {e}")
            return [] 
