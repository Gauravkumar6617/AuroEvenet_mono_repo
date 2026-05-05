"""Pydantic schemas for social posts."""

from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field, ConfigDict, model_validator

from app.schemas.post_tag import PostTagCreate, PostTagResponse


class SocialPostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    # Caller sends plain strings: [{"tag": "python"}, {"tag": "ai"}]
    tags: List[PostTagCreate] = Field(default_factory=list)


class SocialPostResponse(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    created_at: Optional[datetime] = None
    post_tags: List[PostTagResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def flatten_post_tags(cls, data):
        """
        ORM Post.post_tags is a list of PostTag objects, each with a .tag (Tag ORM).
        Flatten them into the PostTagResponse shape expected by the schema.
        """
        if hasattr(data, "post_tags"):
            flat = []
            for pt in data.post_tags:
                if pt.tag and not pt.is_deleted:
                    flat.append({
                        "id": pt.id,
                        "tag_id": pt.tag_id,
                        "tag_name": pt.tag.name,
                        "tag_slug": pt.tag.slug,
                    })
            data.__dict__["post_tags"] = flat
        return data
