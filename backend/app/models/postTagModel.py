from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class PostTag(BaseModel):
    __tablename__ = "post_tags"

    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), nullable=False)

    # Prevent duplicate tag on the same post
    __table_args__ = (UniqueConstraint("post_id", "tag_id", name="uq_post_tag"),)

    # Relationships
    post = relationship("Post", back_populates="post_tags")
    tag = relationship("Tag", back_populates="post_tags")
