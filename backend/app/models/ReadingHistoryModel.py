
from sqlalchemy import Column, Integer, ForeignKey, DateTime ,Boolean ,Index
from sqlalchemy.sql import func
from app.models.baseModel import BaseModel
from datetime import datetime
from sqlalchemy.orm import relationship

class ReadingHistory(BaseModel):
    __tablename__ = "reading_history"

    # Foreign keys to find whose users read which posts
    user_id = Column(Integer,ForeignKey("users.id" ,ondelete="CASCADE"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id",ondelete="CASCADE"), nullable=False)


    #duration
    duration = Column(Integer,default=0)
    scrolled_to_bottom = Column(Boolean,default=False)

    #liked
    liked = Column(Boolean,default=False)

    #timestamp
    created_at = Column(DateTime,default=datetime.utcnow)


    __table_args__ = (
        Index('ix_reading_history_user_id', 'user_id','post_id',unique=True),
    )


    user = relationship("User", back_populates="reading_history")
    post = relationship("Post", back_populates="reading_history")
   


    
 