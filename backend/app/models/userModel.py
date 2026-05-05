from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel
from app.models.models_enum import UserRole, AuthProvider


class User(BaseModel):
    __tablename__ = "users"

    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    role = Column(String, default=UserRole.USER.value)
    auth_provider = Column(String, default=AuthProvider.EMAIL.value)
    auth_provider_id = Column(String(255), nullable=True)

    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    # Relationships
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="author", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", cascade="all, delete-orphan")
    interests = relationship("UserInterest", back_populates="user", cascade="all, delete-orphan")
    # reading_history = relationship("ReadingHistory", back_populates="user", cascade="all, delete-orphan")/
    reading_history = relationship("ReadingHistory", back_populates="user", cascade="all, delete-orphan")
    community_members = relationship("CommunityMember", back_populates="user", cascade="all, delete-orphan")

