"""
User routes — Onboarding flow and Preference management.
All routes require an authenticated user (`get_current_user`).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.userModel import User
from app.models.category import Category
from app.models.topicModel import Topic
from app.models.onboardingQuestionModel import OnboardingQuestion
from app.models.userPreferenceModel import UserPreference
from app.models.userInterestModel import UserInterest
from app.models.tagModel import Tag

from app.schemas.onboarding import (
    OnboardingResponse,
    OnboardingCategoryResponse,
    OnboardingTopicResponse,
)
from app.schemas.admin.question import QuestionResponse
from app.schemas.user_preference import (
    UserPreferenceResponse,
    SaveTopicsRequest,
    SaveAnswersRequest,
)
from app.schemas.userSchema import UserResponse

router = APIRouter(tags=["User"])


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None


@router.get("/user/profile", response_model=UserResponse)
def get_user_profile(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Get current user's profile with all fields."""
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


@router.get("/user/interests")
def get_my_interests(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Return tag names the user has interacted with (interests)."""
    rows = (
        db.query(Tag.name)
        .join(UserInterest, UserInterest.tag_id == Tag.id)
        .filter(UserInterest.user_id == user.id)
        .order_by(UserInterest.score.desc())
        .limit(20)
        .all()
    )
    return [r.name for r in rows]


@router.put("/user/profile", response_model=UserResponse)
def update_user_profile(
    payload: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Update current user's profile fields."""
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user


# ───────────────────── Onboarding (read-only) ─────────────────────


@router.get("/onboarding", response_model=OnboardingResponse)
def get_onboarding_data(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """
    Returns the full onboarding payload grouped:
      categories → topics → questions
    Only active & non-deleted records are included.
    """
    categories = (
        db.query(Category)
        .filter(Category.is_active == True, Category.is_deleted == False)
        .options(
            joinedload(Category.topics).joinedload(Topic.questions)
        )
        .all()
    )

    result: list[OnboardingCategoryResponse] = []
    for cat in categories:
        active_topics: list[OnboardingTopicResponse] = []
        for topic in cat.topics:
            if not topic.is_active or topic.is_deleted:
                continue
            questions = [
                QuestionResponse.model_validate(q)
                for q in topic.questions
                if not q.is_deleted
            ]
            active_topics.append(
                OnboardingTopicResponse(
                    **TopicResponseFields(topic),
                    questions=questions,
                )
            )
        result.append(
            OnboardingCategoryResponse(
                **CategoryResponseFields(cat),
                topics=active_topics,
            )
        )

    return OnboardingResponse(categories=result)


def TopicResponseFields(topic: Topic) -> dict:
    return {
        "id": topic.id,
        "name": topic.name,
        "slug": topic.slug,
        "category_id": topic.category_id,
        "is_active": topic.is_active,
        "created_at": topic.created_at,
        "updated_at": topic.updated_at,
    }


def CategoryResponseFields(cat: Category) -> dict:
    return {
        "id": cat.id,
        "name": cat.name,
        "slug": cat.slug,
        "is_active": cat.is_active,
        "created_at": cat.created_at,
        "updated_at": cat.updated_at,
    }


# ───────────────────── Preferences — Topics ─────────────────────


@router.post(
    "/preferences/topics",
    response_model=list[UserPreferenceResponse],
    status_code=status.HTTP_201_CREATED,
)
def save_selected_topics(
    payload: SaveTopicsRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Replace this user's topic selections.
    Old topic-only preferences are removed first (idempotent).
    """
    # Validate all topic IDs exist
    existing_ids = {
        t.id
        for t in db.query(Topic.id)
        .filter(Topic.id.in_(payload.topic_ids), Topic.is_deleted == False)
        .all()
    }
    invalid = set(payload.topic_ids) - existing_ids
    if invalid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topics not found: {sorted(invalid)}",
        )

    # Remove old topic-only prefs for this user
    db.query(UserPreference).filter(
        UserPreference.user_id == user.id,
        UserPreference.question_id.is_(None),
    ).delete(synchronize_session="fetch")

    # Insert fresh
    prefs = [
        UserPreference(user_id=user.id, topic_id=tid)
        for tid in payload.topic_ids
    ]
    db.add_all(prefs)
    db.commit()

    for p in prefs:
        db.refresh(p)

    return prefs


# ────────────────── Preferences — Answers ────────────────────


@router.post(
    "/preferences/answers",
    response_model=list[UserPreferenceResponse],
    status_code=status.HTTP_201_CREATED,
)
def save_onboarding_answers(
    payload: SaveAnswersRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Save answers to onboarding questions.
    Existing answers are replaced (upsert-like).
    """
    q_ids = [a.question_id for a in payload.answers if a.question_id is not None]

    if q_ids:
        # Validate questions exist
        existing = {
            q.id
            for q in db.query(OnboardingQuestion.id)
            .filter(
                OnboardingQuestion.id.in_(q_ids),
                OnboardingQuestion.is_deleted == False,
            )
            .all()
        }
        invalid = set(q_ids) - existing
        if invalid:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Questions not found: {sorted(invalid)}",
            )

        # Remove old answers for these questions
        db.query(UserPreference).filter(
            UserPreference.user_id == user.id,
            UserPreference.question_id.in_(q_ids),
        ).delete(synchronize_session="fetch")

    prefs = [
        UserPreference(
            user_id=user.id,
            topic_id=a.topic_id,
            question_id=a.question_id,
            answer=a.answer,
        )
        for a in payload.answers
    ]
    db.add_all(prefs)
    db.commit()

    for p in prefs:
        db.refresh(p)

    return prefs


# ─────────────────── Preferences — Read ──────────────────────


@router.get("/preferences", response_model=list[UserPreferenceResponse])
def get_my_preferences(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return (
        db.query(UserPreference)
        .filter(UserPreference.user_id == user.id, UserPreference.is_deleted == False)
        .all()
    )
