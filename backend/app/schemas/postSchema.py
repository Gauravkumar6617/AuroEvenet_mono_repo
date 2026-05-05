from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import List, Optional
from datetime import datetime


class TagInfo(BaseModel):
    id: int
    name: str
    slug: str

    model_config = ConfigDict(from_attributes=True)


class PostBase(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    category_id: int


class PostCreate(PostBase):
    # Caller sends plain strings: ["python", "fastapi"]
    tags: List[str] = []


class PostRead(PostBase):
    id: int
    slug: str
    thumbnail_url: Optional[str] = None
    summary: Optional[str] = None
    is_active: bool
    is_featured: bool
    view_count: int
    like_count: int
    comment_count: int
    share_count: int
    author_id: int
    created_at: datetime
    tags: List[TagInfo] = []

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def extract_tags(cls, data):
        """
        The ORM Post has `post_tags` (list of PostTag objects, each with a .tag).
        We flatten that into `tags` (list of Tag objects) so the schema works cleanly.
        """
        if hasattr(data, "post_tags"):
            data.__dict__["tags"] = [pt.tag for pt in data.post_tags if pt.tag]
        return data
