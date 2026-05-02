from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

class CommentBase(BaseModel):
    content: str = Field(..., max_length=255)
    post_id: int
    user_id: int

class CommentCreate(CommentBase):
    pass

class CommentRead(CommentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)