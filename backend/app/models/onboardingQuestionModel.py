from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class OnboardingQuestion(BaseModel):
    __tablename__ = "onboarding_questions"

    topic_id = Column(
        Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False
    )
    question = Column(String(1024), nullable=False)
    page = Column(Integer, nullable=False, default=1)  # 1–4

    # Relationships
    topic = relationship("Topic", back_populates="questions")
    user_preferences = relationship(
        "UserPreference", back_populates="question", cascade="all, delete-orphan"
    )
