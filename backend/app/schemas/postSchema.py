from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

from app.schemas.post_tag import PostTagResponse

class PostBase(BaseModel):
    title: str = Field(..., max_length=255)
    content: str
    category_id: int

class PostCreate(PostBase):
    # Users send names: ["python", "fastapi"]
    tags: List[str] = []

class PostRead(PostBase):
    id: int
    slug: str
    thumbnail_url: Optional[str] = None
    is_active: bool
    is_featured: bool
    view_count: int
    like_count: int
    comment_count: int
    share_count: int
    author_id: int
    created_at: datetime

    post_tags: List[PostTagResponse] = []

    # Updated for Pydantic v2
    model_config = ConfigDict(from_attributes=True)