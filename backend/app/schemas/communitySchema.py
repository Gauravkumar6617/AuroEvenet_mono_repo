from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class CommunityCreate(BaseModel):
    name: str
    description: Optional[str] = None
    rules: Optional[str] = None
    icon_url: Optional[str] = None
    tags: Optional[str] = None

class CommunityResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    rules: Optional[str] = None
    tags: Optional[str] = None
    is_active: bool
    members_count: int
    posts_count: int
    created_by_id: int
    created_at: datetime
    joined: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)

class CommunityMemberResponse(BaseModel):
    community_id: int
    user_id: int
    username: Optional[str] = None
    role: str
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)
