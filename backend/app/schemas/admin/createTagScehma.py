from pydantic import BaseModel, Field
from typing import Optional

class CreateTagBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = Field(None, max_length=255)

class CreateTagCreate(CreateTagBase):
    pass

class CreateTagRead(CreateTagBase):
    id: int