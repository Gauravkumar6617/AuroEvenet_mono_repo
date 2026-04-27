from sqlalchemy import String,Column,Integer,ForeignKey
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class Comment(BaseModel):
    __tablename__="comments"

    content=Column(String(255),nullable=False)
    user_id=Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=False)
    post_id=Column(Integer,ForeignKey("posts.id",ondelete="CASCADE"),nullable=False)

    user=relationship("User",back_populates="comments")
    post=relationship("Post",back_populates="comments")


