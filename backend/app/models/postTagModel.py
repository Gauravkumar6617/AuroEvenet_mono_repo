from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class PostTag(BaseModel):
    __tablename__ = "post_tags"

    post_id = Column(
        Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False
    )
    tag = Column(String, nullable=False)  # Plain text column matching the DB

    # Prevent duplicate tag on the same post
    __table_args__ = (
        UniqueConstraint("post_id", "tag", name="uq_post_tag"),
    )

    # Relationship back to Post
    post = relationship("Post", back_populates="post_tags")
