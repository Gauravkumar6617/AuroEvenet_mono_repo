"""Pydantic schemas for admin onboarding question CRUD."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class QuestionCreate(BaseModel):
    topic_id: int
    question: str = Field(..., min_length=1, max_length=1024)
    page: int = Field(..., ge=1, le=4)


class QuestionUpdate(BaseModel):
    topic_id: Optional[int] = None
    question: Optional[str] = Field(None, min_length=1, max_length=1024)
    page: Optional[int] = Field(None, ge=1, le=4)


class QuestionResponse(BaseModel):
    id: int
    topic_id: int
    question: str
    page: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
