"""Superadmin routes for User management."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.core.dependencies import require_super_admin
from app.models.userModel import User
from app.models.postModel import Post
from app.models.likeModel import Like
from app.models.commentModel import Comment
from app.models.communityModel import Community
from app.models.userPreferenceModel import UserPreference
from app.models.topicModel import Topic
from app.models.onboardingQuestionModel import OnboardingQuestion
from app.models.userInterestModel import UserInterest
from app.models.tagModel import Tag
from app.schemas.userSchema import UserResponse
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(
    prefix="/admin/users",
    tags=["Superadmin Users"],
)


@router.get("/stats")
def get_platform_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    return {
        "total_users": db.query(func.count(User.id)).scalar(),
        "total_posts": db.query(func.count(Post.id)).scalar(),
        "total_comments": db.query(func.count(Comment.id)).scalar(),
        "total_communities": db.query(func.count(Community.id)).scalar(),
    }


class UserStats(BaseModel):
    post_count: int
    like_count: int
    comment_count: int


class UserWithStats(UserResponse):
    role: str
    auth_provider: str = "email"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    stats: Optional[UserStats] = None

    class Config:
        from_attributes = True


class UserDetail(UserWithStats):
    posts: List[dict] = []
    likes: List[dict] = []


@router.get("", response_model=List[UserWithStats])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    users = db.query(User).all()
    result = []
    for user in users:
        post_count = db.query(Post).filter(Post.author_id == user.id).count()
        like_count = db.query(Like).filter(Like.user_id == user.id).count()
        comment_count = db.query(Comment).filter(Comment.user_id == user.id).count()

        user_dict = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "oauth_provider": "none",
            "auth_provider": user.auth_provider or "email",
            "role": user.role or "user",
            "created_at": str(user.created_at) if hasattr(user, "created_at") and user.created_at else None,
            "updated_at": str(user.updated_at) if hasattr(user, "updated_at") and user.updated_at else None,
            "stats": {
                "post_count": post_count,
                "like_count": like_count,
                "comment_count": comment_count,
            }
        }
        result.append(user_dict)
    return result


@router.put("/{user_id}/role")
def update_user_role(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    next_role = payload.get("role", user.role)
    allowed_roles = {"user", "admin", "super_admin"}
    if next_role not in allowed_roles:
        raise HTTPException(status_code=400, detail="Invalid role")
    user.role = next_role
    db.commit()
    return {"detail": "Role updated"}


@router.put("/{user_id}/ban")
def ban_user(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    return {"detail": "User banned"}


@router.get("/preferences")
def list_user_preferences(
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    result = []

    for user in users:
        preferences = (
            db.query(UserPreference)
            .filter(
                UserPreference.user_id == user.id,
                UserPreference.is_deleted.isnot(True),
            )
            .order_by(UserPreference.created_at.desc())
            .all()
        )

        topic_ids = sorted({pref.topic_id for pref in preferences if pref.topic_id})
        topics = (
            db.query(Topic)
            .filter(Topic.id.in_(topic_ids))
            .all()
            if topic_ids
            else []
        )
        topic_map = {topic.id: topic for topic in topics}

        question_ids = sorted({pref.question_id for pref in preferences if pref.question_id})
        questions = (
            db.query(OnboardingQuestion)
            .filter(OnboardingQuestion.id.in_(question_ids))
            .all()
            if question_ids
            else []
        )
        question_map = {question.id: question for question in questions}

        interests = (
            db.query(Tag.name, UserInterest.score)
            .join(UserInterest, UserInterest.tag_id == Tag.id)
            .filter(
                UserInterest.user_id == user.id,
                UserInterest.is_deleted.isnot(True),
            )
            .order_by(UserInterest.score.desc())
            .limit(12)
            .all()
        )

        selected_topics = [
            {
                "id": topic.id,
                "name": topic.name,
                "slug": topic.slug,
            }
            for topic in topics
        ]

        answers = [
            {
                "id": pref.id,
                "topic": topic_map.get(pref.topic_id).name if pref.topic_id in topic_map else None,
                "question": question_map.get(pref.question_id).question if pref.question_id in question_map else None,
                "answer": pref.answer,
                "created_at": str(pref.created_at) if pref.created_at else None,
            }
            for pref in preferences
            if pref.question_id or (pref.answer and pref.answer not in {"selected", "onboarding_completed"})
        ]

        result.append(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role or "user",
                    "is_active": user.is_active,
                    "created_at": str(user.created_at) if user.created_at else None,
                },
                "selected_topics": selected_topics,
                "answers": answers,
                "interests": [
                    {"name": name, "score": round(float(score or 0), 2)}
                    for name, score in interests
                ],
                "summary": {
                    "topic_count": len(selected_topics),
                    "answer_count": len(answers),
                    "interest_count": len(interests),
                },
            }
        )

    return result


@router.get("/{user_id}", response_model=UserDetail)
def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    post_count = db.query(Post).filter(Post.author_id == user.id).count()
    like_count = db.query(Like).filter(Like.user_id == user.id).count()
    comment_count = db.query(Comment).filter(Comment.user_id == user.id).count()

    posts = db.query(Post).filter(Post.author_id == user.id).order_by(Post.created_at.desc()).all()
    likes = db.query(Like).filter(Like.user_id == user.id).order_by(Like.created_at.desc()).all()

    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "oauth_provider": "none",
        "auth_provider": user.auth_provider or "email",
        "role": user.role or "user",
        "created_at": str(user.created_at) if hasattr(user, "created_at") and user.created_at else None,
        "updated_at": str(user.updated_at) if hasattr(user, "updated_at") and user.updated_at else None,
        "stats": {
            "post_count": post_count,
            "like_count": like_count,
            "comment_count": comment_count,
        },
        "posts": [
            {
                "id": p.id,
                "title": p.title,
                "created_at": str(p.created_at) if hasattr(p, "created_at") and p.created_at else None,
            }
            for p in posts
        ],
        "likes": [
            {
                "id": l.id,
                "post_id": l.post_id,
                "created_at": str(l.created_at) if hasattr(l, "created_at") and l.created_at else None,
            }
            for l in likes
        ],
    }


@router.get("/{user_id}/posts")
def get_user_posts(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    posts = db.query(Post).filter(Post.author_id == user.id).order_by(Post.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "content": p.content,
            "created_at": str(p.created_at) if hasattr(p, "created_at") and p.created_at else None,
            "updated_at": str(p.updated_at) if hasattr(p, "updated_at") and p.updated_at else None,
        }
        for p in posts
    ]


@router.get("/{user_id}/likes")
def get_user_likes(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    likes = db.query(Like).filter(Like.user_id == user.id).order_by(Like.created_at.desc()).all()
    return [
        {
            "id": l.id,
            "post_id": l.post_id,
            "created_at": str(l.created_at) if hasattr(l, "created_at") and l.created_at else None,
        }
        for l in likes
    ]
