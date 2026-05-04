from sqlalchemy import Column, Integer, String
from app.models.baseModel import BaseModel

class CreateTags(BaseModel):
    __tablename__ = "create_tags"
    
    name = Column(String, nullable=False, unique=True,index=True)
    description = Column(String, nullable=True)