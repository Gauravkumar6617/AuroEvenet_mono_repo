from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Text,Table
from sqlalchemy.orm import relationship
from app.models.baseModel import BaseModel


####tags used to related contents 

post_tags = Table(
    "post_tags",
    BaseModel.metadata,
    Column("post_id", Integer, ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)

####tag class
class Tag(BaseModel):
    __tablename__ = "tags"

    name = Column(String(50), unique=True, nullable=False, index=True)
    slug = Column(String(50), unique=True, nullable=False, index=True)

    # Relationship back to posts using the bridge
    posts = relationship("Post", secondary=post_tags, back_populates="tags")


class Post(BaseModel):
    __tablename__ = "posts"

    title = Column(String(255), nullable=False)
  
    content = Column(Text, nullable=False) 
    slug = Column(String(255), nullable=False, unique=True, index=True)
    thumbnail_url = Column(String(512), nullable=True) 


    # VISIBILITY
    is_active = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)

    # COUNTERS
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)

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


    #tags 
    tags = relationship("Tag", secondary=post_tags, back_populates="posts")