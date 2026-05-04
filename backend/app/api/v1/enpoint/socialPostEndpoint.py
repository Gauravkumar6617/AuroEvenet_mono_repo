"""
Social Post routes — create, list, get, delete posts with free-form tags.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.userModel import User
from app.models.postModel import Post
from app.models.postTagModel import PostTag

from app.schemas.social_post import (
    SocialPostCreate,
    SocialPostResponse,
)

router = APIRouter(
    prefix="/posts",
    tags=["Social Posts"],
)


@router.post("", response_model=SocialPostResponse, status_code=status.HTTP_201_CREATED)
def create_social_post(
    payload: SocialPostCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Create a post with optional free-form tags."""
    post = Post(
        title=payload.title,
        content=payload.content,
        author_id=user.id,
        # Required fields from existing model — sensible defaults
        slug=_generate_slug(payload.title, user.id),
        category_id=_default_category_id(db),
    )
    db.add(post)
    db.flush()  # get post.id before adding tags

    for tag_data in payload.tags:
        post_tag = PostTag(post_id=post.id, tag=tag_data.tag)
        db.add(post_tag)

    db.commit()
    db.refresh(post)
    return _to_social_response(post)


@router.get("", response_model=list[SocialPostResponse])
def list_social_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """List posts (newest first) with their tags."""
    posts = (
        db.query(Post)
        .filter(Post.is_deleted == False)
        .options(joinedload(Post.post_tags))
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_to_social_response(p) for p in posts]


@router.get("/{post_id}", response_model=SocialPostResponse)
def get_social_post(
    post_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    post = (
        db.query(Post)
        .filter(Post.id == post_id, Post.is_deleted == False)
        .options(joinedload(Post.post_tags))
        .first()
    )
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return _to_social_response(post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_social_post(
    post_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Only the post author can delete their own post."""
    post = (
        db.query(Post)
        .filter(Post.id == post_id, Post.is_deleted == False)
        .first()
    )
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    if post.author_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your post")

    post.is_deleted = True
    db.commit()
    return None


# ──────────────────── Helpers ────────────────────


def _generate_slug(title: str, user_id: int) -> str:
    """Create a URL-safe slug from the title + user_id to avoid collisions."""
    import re
    from datetime import datetime, timezone

    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    ts = int(datetime.now(timezone.utc).timestamp())
    return f"{base}-{user_id}-{ts}"


def _default_category_id(db: Session) -> int:
    """
    The existing Post model requires a category_id (non-nullable FK).
    Return the first active category as a sensible default.
    Falls back gracefully if none exist.
    """
    from app.models.category import Category

    cat = (
        db.query(Category)
        .filter(Category.is_deleted == False, Category.is_active == True)
        .first()
    )
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active categories exist. Ask a superadmin to create one first.",
        )
    return cat.id


def _to_social_response(post: Post) -> SocialPostResponse:
    """Map the full Post ORM object to the slimmer social response."""
    return SocialPostResponse(
        id=post.id,
        user_id=post.author_id,
        title=post.title,
        content=post.content,
        created_at=post.created_at,
        post_tags=[
            {"id": t.id, "post_id": t.post_id, "tag": t.tag}
            for t in (post.post_tags or [])
            if not t.is_deleted
        ],
    )
