from sqlalchemy import Column, Integer, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class UserInterest(BaseModel):
    __tablename__ = "user_interests"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), nullable=False)

    # Higher score = stronger interest. Incremented on like/read.
    score = Column(Float, default=1.0, nullable=False)

    # One row per user-tag pair
    __table_args__ = (UniqueConstraint("user_id", "tag_id", name="uq_user_interest"),)

    # Relationships
    user = relationship("User", back_populates="interests")
    tag = relationship("Tag", back_populates="user_interests")
