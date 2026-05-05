from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class Tag(BaseModel):
    __tablename__ = "tags"

    name = Column(String(100), unique=True, nullable=False, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    post_count = Column(Integer, default=0)

    # Relationships
    post_tags = relationship("PostTag", back_populates="tag", cascade="all, delete-orphan")
    user_interests = relationship("UserInterest", back_populates="tag", cascade="all, delete-orphan")
