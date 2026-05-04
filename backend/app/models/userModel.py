from sqlalchemy import Column, String ,Boolean
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel
from app.models.models_enum import UserRole , AuthProvider


class User(BaseModel):
    __tablename__ = "users"

    username = Column(String(255), unique=True, index=True, nullable=False) #identity
    email = Column(String(255), unique=True, index=True, nullable=False) #identity
    password_hash = Column(String(255), nullable=True)  #security
    role = Column(String, default=UserRole.USER.value) #authorization
    auth_provider = Column(String, default=AuthProvider.EMAIL.value) #authentication method
    auth_provider_id = Column(String(255), nullable=True) #for social logins

    is_active = Column(Boolean, default=True) #account status

    is_verified = Column(Boolean, default=False) #email verification status


    ## to create relationship
    posts=relationship("Post", back_populates="author" ,cascade="all,delete-orphan")
    comments=relationship("Comment", back_populates="author",cascade="all , delete-orphan")
    likes=relationship("Like", back_populates="author", cascade="all , delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", cascade="all, delete-orphan")




