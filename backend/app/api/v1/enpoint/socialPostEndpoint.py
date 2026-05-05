"""
Social Post routes — create, list, get, delete posts with normalized tags.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.userModel import User
from app.models.postModel import Post
from app.models.postTagModel import PostTag
from app.models.tagModel import Tag
from app.models.userInterestModel import UserInterest

from app.schemas.social_post import SocialPostCreate, SocialPostResponse

router = APIRouter(
    prefix="/posts",
    tags=["Social Posts"],
)


# ─────────────────────── Helpers ───────────────────────

def _upsert_tags(db: Session, raw_tags: list) -> list[Tag]:
    """
    Accept list of PostTagCreate objects, upsert each into the Tag table,
    and return the Tag ORM objects.
    """
    from slugify import slugify
    tags = []
    for tag_data in raw_tags:
        name = tag_data.tag.lower().strip()
        if not name:
            continue
        slug = slugify(name)
        tag = db.query(Tag).filter(Tag.slug == slug).first()
        if not tag:
            tag = Tag(name=name, slug=slug)
            db.add(tag)
            db.flush()
        tags.append(tag)
    return tags


def _bump_user_interests(db: Session, user_id: int, tags: list[Tag], increment: float = 1.0):
    for tag in tags:
        interest = (
            db.query(UserInterest)
            .filter(UserInterest.user_id == user_id, UserInterest.tag_id == tag.id)
            .first()
        )
        if interest:
            interest.score += increment
        else:
            db.add(UserInterest(user_id=user_id, tag_id=tag.id, score=increment))


def _generate_slug(title: str, user_id: int) -> str:
    import re
    from datetime import datetime, timezone
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    ts = int(datetime.now(timezone.utc).timestamp())
    return f"{base}-{user_id}-{ts}"


def _default_category_id(db: Session) -> int:
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


# ─────────────────────── Routes ────────────────────────

@router.post("", response_model=SocialPostResponse, status_code=status.HTTP_201_CREATED)
def create_social_post(
    payload: SocialPostCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Create a post with optional tags. Tags are normalized and stored in the Tag table."""
    post = Post(
        title=payload.title,
        content=payload.content,
        author_id=user.id,
        slug=_generate_slug(payload.title, user.id),
        category_id=_default_category_id(db),
    )
    db.add(post)
    db.flush()

    # Upsert tags and link to post
    tag_objects = _upsert_tags(db, payload.tags)
    for tag in tag_objects:
        db.add(PostTag(post_id=post.id, tag_id=tag.id))
        tag.post_count = (tag.post_count or 0) + 1

    db.commit()
    db.refresh(post)
    return post


@router.get("", response_model=list[SocialPostResponse])
def list_social_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """List posts newest-first with their tags."""
    return (
        db.query(Post)
        .filter(Post.is_deleted == False)
        .options(joinedload(Post.post_tags).joinedload(PostTag.tag))
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{post_id}", response_model=SocialPostResponse)
def get_social_post(
    post_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    post = (
        db.query(Post)
        .filter(Post.id == post_id, Post.is_deleted == False)
        .options(joinedload(Post.post_tags).joinedload(PostTag.tag))
        .first()
    )
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    # Record view → bump tag interests slightly
    _bump_user_interests(db, user.id, [pt.tag for pt in post.post_tags if pt.tag], increment=0.5)
    post.view_count = (post.view_count or 0) + 1
    db.commit()

    return post


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

    # Decrement tag post counts
    for pt in post.post_tags:
        if pt.tag and pt.tag.post_count > 0:
            pt.tag.post_count -= 1

    post.is_deleted = True
    db.commit()
    return None
