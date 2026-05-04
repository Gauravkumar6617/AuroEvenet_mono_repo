from sqlalchemy import Column, String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class Topic(BaseModel):
    __tablename__ = "topics"

    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    is_active = Column(Boolean, default=True)

    # FK → categories
    category_id = Column(
        Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False
    )

    # Relationships
    category = relationship("Category", back_populates="topics")
    questions = relationship(
        "OnboardingQuestion", back_populates="topic", cascade="all, delete-orphan"
    )
    user_preferences = relationship(
        "UserPreference", back_populates="topic", cascade="all, delete-orphan"
    )
