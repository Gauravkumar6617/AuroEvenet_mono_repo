from turtle import screensize
from sqlalchemy.orm import Session
from typing import List
from app.models.postModel import Post
from app.models.tagModel import Tag
from app.models.userInterestModel import UserInterest
from app.models.commentModel import Comment

class AiRepositorires:

    ###to get all comments text for a post
    @staticmethod
    def get_comments_text(db: Session, post_id: int)->List[str]:
        try:
          return [ c.content for c in db.query(Comment).filter(Comment.post_id == post_id).all()]
        except Exception as e:
            print(f"Error getting comments text: {e}")
            return {"error": "Error getting comments text"} 
        
    ###to get all post content for a post
    @staticmethod
    def get_post_content(db: Session, post_id: int)->None:
       try:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return None
        return post
       except Exception as e:
        print(f"Error getting post content: {e}")
        return {"error": "Error getting post content"} 


    ###to get tag by id 
    @staticmethod
    def get_tag_by_id(db: Session, tag_id: int)->Tag | None:
        try:
            return db.query(Tag).filter(Tag.id == tag_id).first()
        except Exception as e:
            print(f"Error getting tag by id: {e}")
            return {"error": "Error getting tag by id"} 
        

    ###to get all user interests for a user
    @staticmethod
    def get_user_interests(db: Session, user_id: int)->List[UserInterest] | None:
        try:
            return db.query(UserInterest).filter(UserInterest.user_id == user_id).all()
        except Exception as e:
            print(f"Error getting user interests: {e}")
            return None 

    #to add upsert user interest 
    @staticmethod
    def upsert_user_interest(db: Session, user_id: int, tag_id: int ,weight: float)->None:
        try:
            existing=db.query(UserInterest).filter(UserInterest.user_id == user_id, UserInterest.tag_id == tag_id).first()
            if existing:
                existing.score = weight
            else:
                new_interest = UserInterest(user_id=user_id, tag_id=tag_id, score=weight)
                db.add(new_interest)
            db.commit()
        except Exception as e:
            print(f"Error upserting user interest: {e}")
            return None 
        
   #to delete user interest
    @staticmethod
    def delete_user_interest(db: Session, user_id: int, tag_id: int)->None:
        try:
            delete=db.query(UserInterest).filter(UserInterest.user_id == user_id, UserInterest.tag_id == tag_id).delete(synchronize_session="fetch")
            db.commit()
            return delete >0
        except Exception as e:
            print(f"Error deleting user interest: {e}")
            return None 
        
 
    