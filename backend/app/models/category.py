from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class Category(BaseModel):
    __tablename__ = "categories"

    name = Column(String(50), unique=True, nullable=False, index=True)
    slug = Column(String(50), unique=True, nullable=False, index=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    posts = relationship("Post", back_populates="category")
    topics = relationship(
        "Topic", back_populates="category", cascade="all, delete-orphan"
    )