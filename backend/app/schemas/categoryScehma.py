from pydantic import BaseModel,ConfigDict, Field
from typing import List, Optional
from datetime import datetime

class CategoryBase(BaseModel):
    name: str = Field(..., max_length=255)
    slug: str   

class CategoryCreate(CategoryBase):
   pass

class CategoryRead(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool

    model_config = ConfigDict(from_attributes=True)
