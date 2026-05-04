"""Pydantic schemas for social posts."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.schemas.post_tag import PostTagCreate, PostTagResponse


class SocialPostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    tags: list[PostTagCreate] = Field(default_factory=list)


class SocialPostResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    created_at: Optional[datetime] = None
    post_tags: list[PostTagResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}
