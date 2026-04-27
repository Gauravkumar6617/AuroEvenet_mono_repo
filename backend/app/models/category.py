from sqlalchemy import Column ,Integer,String,ForeignKey
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel  


class Category(BaseModel):
    __tablename__ = "categories"

    name = Column(String(50), unique=True, nullable=False, index=True)
    slug=Column(String(50), unique=True, nullable=False, index=True)

    posts = relationship("Post", back_populates="category" )