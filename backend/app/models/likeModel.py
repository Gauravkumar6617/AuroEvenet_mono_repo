from sqlalchemy import Column,String,Integer,ForeignKey
from app.models.baseModel import BaseModel
from sqlalchemy.orm import relationship


class Like(BaseModel):
    __tablename__="likes"

    author_id=Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=False)
    post_id=Column(Integer,ForeignKey("posts.id",ondelete="CASCADE"),nullable=False)

    author=relationship("User",back_populates="like")
    post=relationship("Post",back_populates="likes")