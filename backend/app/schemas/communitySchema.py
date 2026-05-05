from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CreateCommunityBase(BaseModel):
    name: str
    description: Optional[str] = None
    rules: Optional[str] = None

class CommunityResponse(CreateCommunityBase):
    id: int
    name: str
    slug: str
    description: Optional[str]
    icon_url: Optional[str]
    rules: Optional[str]
    is_active: bool
    member_count: int
    post_count: int
    created_by_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CommunityMemberResponse(BaseModel):
    community_id: int
    user_id: int
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True
