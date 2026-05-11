"""Superadmin routes for User management."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import require_super_admin
from app.models.userModel import User
from app.models.postModel import Post
from app.models.likeModel import Like
from app.models.commentModel import Comment
from app.schemas.userSchema import UserResponse
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(
    prefix="/admin/users",
    tags=["Superadmin Users"],
)


class UserStats(BaseModel):
    post_count: int
    like_count: int
    comment_count: int


class UserWithStats(UserResponse):
    role: str
    auth_provider: str
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
            "oauth_provider": user.auth_provider or "email",
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
        "oauth_provider": user.auth_provider or "email",
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
