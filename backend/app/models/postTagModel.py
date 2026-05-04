from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class PostTag(BaseModel):
    __tablename__ = "post_tags"

    post_id = Column(
        Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False
    )
    tag = Column(String(255), nullable=False, index=True)

    # Relationship
    post = relationship("Post", back_populates="post_tags")
