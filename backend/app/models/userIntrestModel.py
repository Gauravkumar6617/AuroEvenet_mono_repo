from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel

class UserIntrest(BaseModel):
    __tablename__ = "user_intrests"
    
    # user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # intrest_id = Column(Integer, ForeignKey("intrests.id"), nullable=False)
    
    # user = relationship("User", back_populates="user_intrests")
    # intrest = relationship("Intrest", back_populates="user_intrests")