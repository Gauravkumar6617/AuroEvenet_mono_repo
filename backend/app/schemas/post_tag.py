from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class PostTagCreate(BaseModel):
    tag: str  # from the request body


class PostTagResponse(BaseModel):
    id: int
    tag: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
