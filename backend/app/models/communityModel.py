import sqlalchemy as sa
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.baseModel import BaseModel

class Community(BaseModel):
    __tablename__ = "communities"
    
    name = Column(String(255), nullable=False,unique=True) #identity
    slug = Column(String(255), nullable=False, unique=True)
    description = Column(String(255), nullable=True) #description
    is_active = Column(Boolean, nullable=False, default=True) #active
    icon_url = Column(String(255), nullable=True) #icon
    rules = Column(Text, nullable=True) #rules

    #user
    members_count = Column(Integer, default=0)

    #posts
    posts_count = Column(Integer, default=0)

    #rules
    rules_count = Column(Text, default="")

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False) #creator
    
    #relations
    posts=relationship("Post", back_populates="community")

    members=relationship("CommunityMember", back_populates="community",cascade="all, delete-orphan")



class CommunityMember(BaseModel):
    __tablename__ = "community_members"
    
    community_id = Column(Integer, ForeignKey("communities.id",ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id",ondelete="CASCADE"), nullable=False)
    
    joined_at = Column(DateTime, default=datetime.utcnow)
    role = Column(String(50), default="member") #member, moderator, admin

    ##to prevent user from joing again
    __table_args__ = (
        sa.UniqueConstraint('community_id', 'user_id', name='uq_community_user'),
    )
    
    #relations
    community=relationship("Community", back_populates="members")
    user=relationship("User", back_populates="community_members")
    
    

