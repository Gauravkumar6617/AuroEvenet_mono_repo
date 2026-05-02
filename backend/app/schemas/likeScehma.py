from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LikeBase(BaseModel):
    post_id: int
    user_id: int


class LikeCreate(LikeBase):
    pass


class LikeRead(LikeBase):
   

    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
