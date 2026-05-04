"""Pydantic schemas for post tags."""

from pydantic import BaseModel, Field


class PostTagCreate(BaseModel):
    tag: str = Field(..., min_length=1, max_length=255)


class PostTagResponse(BaseModel):
    id: int
    post_id: int
    tag: str

    model_config = {"from_attributes": True}
