from pydantic import BaseModel
from typing import Optional ,List
from datetime import datetime

class EnchanceRequest(BaseModel):
    title: str
    content: str

class EnhanceResponse(BaseModel):
    title: str
    content: str
    suggested_tags: list[str]
    improvements: list[str]

class SuggestTagRequest(BaseModel):
    tag: str
    previous_tags: str

class SuggestTagResponse(BaseModel):
    suggested_tag: List[str]

class TopicWeightUpdate(BaseModel):
    topic: str
    weight: float

class TopicResponse(BaseModel):
    tag_id: int
    tag_name: Optional[str]
    weight: float

    class Config:
        from_attributes = True

