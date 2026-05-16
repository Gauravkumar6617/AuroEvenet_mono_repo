"""
User routes — Onboarding flow and Preference management.
All routes require an authenticated user (`get_current_user`).
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from slugify import slugify
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.core.dependencies import get_current_user, get_optional_user
from app.models.userModel import User
from app.models.category import Category
from app.models.topicModel import Topic
from app.models.onboardingQuestionModel import OnboardingQuestion
from app.models.userPreferenceModel import UserPreference
from app.models.userInterestModel import UserInterest
from app.models.tagModel import Tag
from app.models.postModel import Post
from app.models.postTagModel import PostTag

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


def _topic_tag_names(topic: Topic) -> set[str]:
    """Possible tag values that should map to this onboarding topic."""
    values = {topic.name, topic.slug, slugify(topic.name or "")}
    return {v.strip().lower() for v in values if v and v.strip()}


def _topic_post_count(db: Session, topic: Topic) -> int:
    tag_names = _topic_tag_names(topic)
    if not tag_names:
        return 0
    return (
        db.query(func.count(func.distinct(Post.id)))
        .join(PostTag, PostTag.post_id == Post.id)
        .filter(
            Post.is_deleted == False,
            func.lower(PostTag.tag).in_(tag_names),
        )
        .scalar()
        or 0
    )


def _seed_user_interest_from_topic(db: Session, user_id: int, topic: Topic) -> tuple[str | None, int]:
    tag_names = _topic_tag_names(topic)
    if not tag_names:
        return None, 0

    tag = (
        db.query(Tag)
        .filter(
            (func.lower(Tag.name).in_(tag_names))
            | (func.lower(Tag.slug).in_(tag_names))
        )
        .first()
    )
    if not tag:
        return None, 0

    interest = (
        db.query(UserInterest)
        .filter(UserInterest.user_id == user_id, UserInterest.tag_id == tag.id)
        .first()
    )
    if interest:
        interest.score = max(interest.score, 3.0)
    else:
        db.add(UserInterest(user_id=user_id, tag_id=tag.id, score=3.0))

    post_count = (
        db.query(func.count(func.distinct(Post.id)))
        .join(PostTag, PostTag.post_id == Post.id)
        .filter(Post.is_deleted == False, func.lower(PostTag.tag) == tag.name.lower())
        .scalar()
        or 0
    )
    return tag.name, post_count


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


@router.post("/user/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Upload avatar to Cloudinary via backend (keeps API secret server-side)."""
    import cloudinary
    import cloudinary.uploader
    from app.core.config import settings
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
    )
    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder="blogbyte/avatars",
            transformation={"width": 256, "height": 256, "crop": "fill", "gravity": "face"},
            public_id=f"avatar_{user.id}",
            overwrite=True,
        )
        url = result.get("secure_url")
        db_user = db.query(User).filter(User.id == user.id).first()
        db_user.avatar_url = url
        db.commit()
        return {"avatar_url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/user/interests")
def get_my_interests(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Return tag names the user has interacted with (interests)."""
    rows = (
        db.query(Tag.name, UserInterest.score)
        .join(UserInterest, UserInterest.tag_id == Tag.id)
        .filter(UserInterest.user_id == user.id)
        .order_by(UserInterest.score.desc())
        .limit(20)
        .all()
    )
    return [r.name for r in rows]


@router.get("/user/interests/full")
def get_my_interests_full(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Return full interest objects with tag id, name, score."""
    rows = (
        db.query(Tag.id, Tag.name, Tag.slug, UserInterest.score)
        .join(UserInterest, UserInterest.tag_id == Tag.id)
        .filter(UserInterest.user_id == user.id)
        .order_by(UserInterest.score.desc())
        .all()
    )
    return [{"tag_id": r.id, "tag_name": r.name, "slug": r.slug, "score": round(float(r.score or 0), 2)} for r in rows]


@router.post("/user/interests")
def upsert_interest(
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Set a specific tag interest score. Creates or updates."""
    tag_name = payload.get("tag_name", "").lower().strip()
    score = float(payload.get("score", 5.0))
    if not tag_name:
        raise HTTPException(status_code=400, detail="tag_name required")

    tag = db.query(Tag).filter(Tag.name == tag_name).first()
    if not tag:
        from slugify import slugify
        tag = Tag(name=tag_name, slug=slugify(tag_name))
        db.add(tag)
        db.flush()

    interest = db.query(UserInterest).filter(
        UserInterest.user_id == user.id, UserInterest.tag_id == tag.id
    ).first()
    if interest:
        interest.score = score
    else:
        db.add(UserInterest(user_id=user.id, tag_id=tag.id, score=score))
    db.commit()
    return {"tag_name": tag_name, "score": score}


@router.post("/user/interests/bulk")
def bulk_upsert_interests(
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Bulk set interest scores. payload: {interests: [{tag_name, score}]}"""
    from slugify import slugify
    items = payload.get("interests", [])
    for item in items:
        tag_name = item.get("tag_name", "").lower().strip()
        score = float(item.get("score", 5.0))
        if not tag_name:
            continue
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name, slug=slugify(tag_name))
            db.add(tag)
            db.flush()
        interest = db.query(UserInterest).filter(
            UserInterest.user_id == user.id, UserInterest.tag_id == tag.id
        ).first()
        if interest:
            interest.score = score
        else:
            db.add(UserInterest(user_id=user.id, tag_id=tag.id, score=score))
    db.commit()
    return {"saved": len(items)}


@router.get("/user/public/{username}")
def get_public_profile(
    username: str,
    db: Session = Depends(get_db),
):
    """Public profile for any user by username — no auth required."""
    from app.models.postModel import Post
    from app.models.commentModel import Comment
    from app.models.communityModel import Community, CommunityMember
    from sqlalchemy.orm import selectinload

    target = db.query(User).filter(User.username == username).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    posts = (
        db.query(Post)
        .options(selectinload(Post.post_tags))
        .filter(Post.author_id == target.id)
        .order_by(Post.created_at.desc())
        .all()
    )

    comments = (
        db.query(Comment)
        .filter(Comment.user_id == target.id)
        .order_by(Comment.created_at.desc())
        .limit(20)
        .all()
    )

    # post titles for comments
    post_map = {p.id: p for p in db.query(Post).filter(
        Post.id.in_([c.post_id for c in comments])
    ).all()}

    communities = (
        db.query(Community)
        .join(CommunityMember, CommunityMember.community_id == Community.id)
        .filter(CommunityMember.user_id == target.id, Community.is_active == True)
        .all()
    )

    interests = (
        db.query(Tag.name)
        .join(UserInterest, UserInterest.tag_id == Tag.id)
        .filter(UserInterest.user_id == target.id)
        .order_by(UserInterest.score.desc())
        .limit(20)
        .all()
    )

    return {
        "user": {
            "id": target.id,
            "username": target.username,
            "full_name": target.full_name,
            "bio": target.bio,
            "location": target.location,
            "website": target.website,
            "avatar_url": target.avatar_url,
            "role": target.role,
            "created_at": str(target.created_at) if target.created_at else None,
        },
        "posts": [
            {
                "id": p.id,
                "title": p.title,
                "slug": p.slug,
                "like_count": p.like_count,
                "comment_count": p.comment_count,
                "view_count": p.view_count,
                "created_at": str(p.created_at),
                "tags": [pt.tag for pt in p.post_tags if pt.tag],
            }
            for p in posts
        ],
        "comments": [
            {
                "id": c.id,
                "content": c.content,
                "post_id": c.post_id,
                "post_title": post_map.get(c.post_id, {}).title if c.post_id in post_map else None,
                "post_slug": post_map.get(c.post_id, {}).slug if c.post_id in post_map else None,
                "created_at": str(c.created_at),
            }
            for c in comments
        ],
        "communities": [
            {"name": c.name, "slug": c.slug, "icon_url": c.icon_url, "members_count": c.members_count}
            for c in communities
        ],
        "interests": [r.name for r in interests],
    }


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
    _: User | None = Depends(get_optional_user),
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

    print(
        "[OnboardingDebug:API] active categories loaded",
        {
            "category_count": len(categories),
            "topic_count": sum(len(cat.topics) for cat in categories),
            "question_count": sum(len(topic.questions) for cat in categories for topic in cat.topics),
        },
        flush=True,
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
                    post_count=_topic_post_count(db, topic),
                    questions=questions,
                )
            )
        result.append(
            OnboardingCategoryResponse(
                **CategoryResponseFields(cat),
                topics=active_topics,
            )
        )

    print(
        "[OnboardingDebug:API] onboarding response",
        {
            "category_count": len(result),
            "topic_count": sum(len(cat.topics) for cat in result),
            "question_count": sum(len(topic.questions) for cat in result for topic in cat.topics),
        },
        flush=True,
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

    selected_topics = (
        db.query(Topic)
        .filter(Topic.id.in_(payload.topic_ids), Topic.is_deleted == False)
        .all()
    )

    topic_debug = []
    for topic in selected_topics:
        matched_tag, post_count = _seed_user_interest_from_topic(db, user.id, topic)
        topic_debug.append(
            {
                "topic_id": topic.id,
                "topic_name": topic.name,
                "matched_tag": matched_tag,
                "available_posts": post_count,
            }
        )

    print(
        "[OnboardingDebug:API] user selected topics",
        {"user_id": user.id, "topics": topic_debug},
        flush=True,
    )

    # Insert fresh
    prefs = [
        UserPreference(user_id=user.id, topic_id=tid, answer="selected")
        for tid in payload.topic_ids
    ]
    db.add_all(prefs)
    db.commit()

    for p in prefs:
        db.refresh(p)

    return prefs


# ────────────────── Preferences — Answers ────────────────────


@router.post(
    "/preferences/onboarding-complete",
    response_model=UserPreferenceResponse,
    status_code=status.HTTP_201_CREATED,
)
def mark_onboarding_complete(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Mark onboarding complete when there is no configured topic/question to attach.
    """
    db.query(UserPreference).filter(
        UserPreference.user_id == user.id,
        UserPreference.topic_id.is_(None),
        UserPreference.question_id.is_(None),
        UserPreference.answer == "onboarding_completed",
    ).delete(synchronize_session="fetch")

    pref = UserPreference(user_id=user.id, answer="onboarding_completed")
    db.add(pref)
    db.commit()
    db.refresh(pref)
    return pref


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
