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
            
            # Use getattr to safely get all fields from the object
            obj_dict = {
                "id": data.id,
                "title": data.title,
                "content": data.content,
                "category_id": data.category_id,
                "slug": data.slug,
                "thumbnail_url": data.thumbnail_url,
                "summary": data.summary,
                "is_active": data.is_active,
                "is_featured": data.is_featured,
                "view_count": data.view_count,
                "like_count": data.like_count,
                "comment_count": data.comment_count,
                "share_count": data.share_count,
                "author_id": data.author_id,
                "created_at": data.created_at,
                "tags": [pt.tag for pt in data.post_tags if pt.tag]
            }
            return obj_dict
        return data
