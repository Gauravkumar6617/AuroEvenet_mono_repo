from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Text, Float
from sqlalchemy.orm import relationship ,Mapped , mapped_column
from app.models.baseModel import BaseModel
from typing import Optional


class Post(BaseModel):
    __tablename__ = "posts"

    title = Column(String(255), nullable=False)
  
    content = Column(Text, nullable=False) 
    slug = Column(String(255), nullable=False, unique=True, index=True)
    thumbnail_url = Column(String(512), nullable=True) 
    

    ###ai feautre
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # VISIBILITY
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)

    # COUNTERS
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)
    trending_score = Column(Float, default=0.0)

    # RELATIONSHIPS
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # Pluralize 'posts' to match User.posts
    author = relationship("User", back_populates="posts") 
    
    # Plural names for lists
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")

    # CATEGORY
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    category = relationship("Category", back_populates="posts")


    # Free-form user tags
    post_tags = relationship("PostTag", back_populates="post", cascade="all, delete-orphan")


    ###Reading History
    reading_history = relationship("ReadingHistory", back_populates="post", cascade="all, delete-orphan")


    # Community
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=True)
    community = relationship("Community", back_populates="posts")
