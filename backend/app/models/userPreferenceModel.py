from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


class UserPreference(BaseModel):
    __tablename__ = "user_preferences"

    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    topic_id = Column(
        Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=True
    )
    question_id = Column(
        Integer,
        ForeignKey("onboarding_questions.id", ondelete="CASCADE"),
        nullable=True,
    )
    answer = Column(Text, nullable=True)

    # Relationships
    user = relationship("User", back_populates="preferences")
    topic = relationship("Topic", back_populates="user_preferences")
    question = relationship("OnboardingQuestion", back_populates="user_preferences")
