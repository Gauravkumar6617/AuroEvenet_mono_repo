from sqlalchemy import Column, String, Boolean, Text ,Table,ForeignKey ,and_
from sqlalchemy.orm import relationship ,foreign ,remote 
from app.models.baseModel import BaseModel
from app.models.models_enum import UserRole, AuthProvider


user_follower = Table(
    "follower",
    BaseModel.metadata,
    Column("follower_id", ForeignKey("users.id"), primary_key=True),
    Column("followed_id", ForeignKey("users.id"), primary_key=True),
)

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

    # Profile fields
    full_name = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)
    website = Column(String(512), nullable=True)
    avatar_url = Column(String(512), nullable=True)

    # Relationships
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="author", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", cascade="all, delete-orphan")
    interests = relationship("UserInterest", back_populates="user", cascade="all, delete-orphan")
    # reading_history = relationship("ReadingHistory", back_populates="user", cascade="all, delete-orphan")/
    reading_history = relationship("ReadingHistory", back_populates="user", cascade="all, delete-orphan")
    community_members = relationship("CommunityMember", back_populates="user", cascade="all, delete-orphan")


    ####follower feautres
    following = relationship(
        "User",
        secondary=user_follower,
        primaryjoin=lambda: User.id == user_follower.c.follower_id,
        secondaryjoin=lambda: User.id == user_follower.c.followed_id,
        backref="followers",
        foreign_keys=[user_follower.c.follower_id, user_follower.c.followed_id],
    )