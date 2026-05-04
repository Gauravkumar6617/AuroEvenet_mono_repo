"""Pydantic schemas for user preferences."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class UserPreferenceCreate(BaseModel):
    topic_id: Optional[int] = None
    question_id: Optional[int] = None
    answer: Optional[str] = None


class UserPreferenceResponse(BaseModel):
    id: int
    user_id: int
    topic_id: Optional[int] = None
    question_id: Optional[int] = None
    answer: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class SaveTopicsRequest(BaseModel):
    """Bulk save selected topic IDs."""
    topic_ids: list[int] = Field(..., min_length=1)


class SaveAnswersRequest(BaseModel):
    """Bulk save answers to onboarding questions."""
    answers: list[UserPreferenceCreate]
