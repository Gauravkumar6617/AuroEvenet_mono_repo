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
    community_id: Optional[int] = None


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
    author_name: Optional[str] = None
    category_id: int
    category_name: Optional[str] = None
    community_id: Optional[int] = None
    created_at: datetime
    tags: List[str] = []

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def extract_tags(cls, data):
        """
        The ORM Post has `post_tags` (list of PostTag objects, each with a .tag).
        Flatten that into a list of plain tag strings for the response.
        """
        if isinstance(data, dict):
            if "post_tags" in data and "tags" not in data:
                data["tags"] = [pt.tag for pt in data["post_tags"] if pt.tag]
            return data
            
        if hasattr(data, "post_tags"):
            # If it's an ORM object, we create a dict to ensure Pydantic 
            # picks up our custom 'tags' list instead of trying to 
            # find a 'tags' attribute on the ORM object which doesn't exist.

            return {
                "id": data.id,
                "title": data.title,
                "content": data.content,
                "category_id": data.category_id,
                "slug": data.slug,
                "thumbnail_url": getattr(data, 'thumbnail_url', None),
                "summary": data.summary,
                "is_active": data.is_active,
                "is_featured": data.is_featured,
                "view_count": getattr(data, "view_count", 0) or 0,
                "like_count": getattr(data, "like_count", 0) or 0,
                "comment_count": getattr(data, "comment_count", 0) or 0,
                "share_count": getattr(data, "share_count", 0) or 0,
                "author_id": data.author_id,
                "author_name": data.author.username if data.author else None,
                "created_at": getattr(data, 'created_at', None),
                "category_name": data.category.name if data.category else None,
                "community_id": getattr(data, "community_id", None),
                "tags": [pt.tag for pt in data.post_tags if pt.tag]
            }
        return data
