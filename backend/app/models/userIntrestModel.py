from sqlalchemy import Column, Integer, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class UserInterest(BaseModel):
    """
    Tracks how strongly a user is interested in a given tag.
    score is incremented every time the user likes or reads a post
    that carries that tag. Used by the personalized feed to rank posts.
    """
    __tablename__ = "user_interests"

    __table_args__ = (
        UniqueConstraint("user_id", "tag_id", name="uq_user_tag"),
    )

    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    tag_id = Column(
        Integer, ForeignKey("tags.id", ondelete="CASCADE"), nullable=False
    )
    # Higher score = stronger interest. Increment on like/read.
    score = Column(Float, default=1.0, nullable=False)

    # Relationships
    user = relationship("User", back_populates="interests")
    tag = relationship("Tag", back_populates="user_interests")
