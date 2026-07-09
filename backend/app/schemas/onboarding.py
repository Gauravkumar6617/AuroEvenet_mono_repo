"""Pydantic schemas for onboarding responses."""

from pydantic import BaseModel, Field

from app.schemas.admin.category import CategoryResponse
from app.schemas.admin.topic import TopicResponse
from app.schemas.admin.question import QuestionResponse


class OnboardingTopicResponse(TopicResponse):
    post_count: int = 0
    questions: list[QuestionResponse] = Field(default_factory=list)


class OnboardingCategoryResponse(CategoryResponse):
    topics: list[OnboardingTopicResponse] = Field(default_factory=list)


class OnboardingResponse(BaseModel):
    categories: list[OnboardingCategoryResponse]
