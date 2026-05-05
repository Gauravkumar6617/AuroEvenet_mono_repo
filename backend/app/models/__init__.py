from app.db.session import Base

from app.models.baseModel import BaseModel
from app.models.userModel import User
from app.models.postModel import Post
from app.models.category import Category
from app.models.commentModel import Comment
from app.models.likeModel import Like

# Tag system (normalized)
from app.models.tagModel import Tag
from app.models.postTagModel import PostTag
from app.models.userInterestModel import UserInterest

# Onboarding
from app.models.topicModel import Topic
from app.models.onboardingQuestionModel import OnboardingQuestion
from app.models.userPreferenceModel import UserPreference

from app.models.models_enum import UserRole, AuthProvider

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
    "Tag",
    "PostTag",
    "UserInterest",
    "Topic",
    "OnboardingQuestion",
    "UserPreference",
]
