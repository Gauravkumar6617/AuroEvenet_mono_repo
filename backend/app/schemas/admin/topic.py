"""Pydantic schemas for admin topic CRUD."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TopicCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=255)
    category_id: int
    is_active: bool = True


class TopicUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    slug: Optional[str] = Field(None, min_length=1, max_length=255)
    category_id: Optional[int] = None
    is_active: Optional[bool] = None


class TopicResponse(BaseModel):
    id: int
    name: str
    slug: str
    category_id: int
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
