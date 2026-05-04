# app/models/__init__.py

# 1. Import the Base that all models inherit from
from app.db.session import Base 

# 2. Import your models so they register with the Base above
from app.models.baseModel import BaseModel
from app.models.userModel import User
from app.models.postModel import Post
from app.models.category import Category
from app.models.commentModel import Comment
from app.models.likeModel import Like
from app.models.userIntrestModel import UserIntrest

# New social / onboarding models
from app.models.topicModel import Topic
from app.models.onboardingQuestionModel import OnboardingQuestion
from app.models.userPreferenceModel import UserPreference
from app.models.postTagModel import PostTag


# 3. Import Enums if they are used as columns (Alembic needs these for Postgres)
from app.models.models_enum import UserRole, AuthProvider

# This makes importing cleaner in other files
__all__ = [
    "Base",
    "BaseModel",
    "User",
    "UserRole",
    "AuthProvider",
    "Post",
    "Category",
    "Like",
    "Comment",
    "UserIntrest",
    # New models
    "Topic",
    "OnboardingQuestion",
    "UserPreference",
    "PostTag",
]