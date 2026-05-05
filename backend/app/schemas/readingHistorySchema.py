from pydantic import BaseModel 
from datetime import datetime
from typing import Optional

class TrackHistoryRequest(BaseModel):
    post_id: int
    duration_seconds: int = 0
    scrolled_to_bottom: bool = False
    liked: bool = False

class ReadingHistoryResponse(BaseModel):
    id: int
    user_id: int
    post_id: int
    duration_seconds: int = 0
    scrolled_to_bottom: bool = False
    liked: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

