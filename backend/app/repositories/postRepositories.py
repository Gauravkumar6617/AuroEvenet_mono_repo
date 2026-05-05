import cloudinary
import cloudinary.uploader
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from slugify import slugify
from fastapi import HTTPException, UploadFile, BackgroundTasks

from app.models.postModel import Post
from app.models.postTagModel import PostTag
from app.models.tagModel import Tag
from app.models.userInterestModel import UserInterest
from app.core.config import settings
from app.service.aiService import generate_summary


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)


def _upsert_tags(db: Session, tag_names: List[str]) -> List[Tag]:
    """
    Given a list of raw tag strings, lowercase + slugify each one,
    insert any that don't exist yet, and return the Tag ORM objects.
    """
    tags: List[Tag] = []
    for raw in tag_names:
        name = raw.lower().strip()
        if not name:
            continue
        slug = slugify(name)

        tag = db.query(Tag).filter(Tag.slug == slug).first()
        if not tag:
            tag = Tag(name=name, slug=slug)
            db.add(tag)
            db.flush()  # get tag.id without committing yet

        tags.append(tag)
    return tags


def _bump_user_interests(db: Session, user_id: int, tags: List[Tag], increment: float = 1.0):
    """
    For each tag, increment the user's interest score by `increment`.
    Creates a UserInterest row if one doesn't exist yet.
    """
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


class PostRepository:

    # ------------------------------------------------------------------ #
    #  CREATE                                                              #
    # ------------------------------------------------------------------ #
    @staticmethod
    def create_post(
        db: Session,
        title: str,
        content: str,
        author_id: int,
        category_id: int,
        tags: List[str],
        image: Optional[UploadFile],
        bg_tasks: BackgroundTasks,
    ) -> Post:
        # 1. Upload thumbnail to Cloudinary (optional)
        image_url = None
        if image is not None:
            try:
                upload_result = cloudinary.uploader.upload(
                    image.file,
                    folder="blogbyte/posts",
                    transformation={"width": 800, "height": 450, "crop": "fill"},
                )
                image_url = upload_result.get("secure_url")
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

        # 2. Generate a unique slug
        base_slug = slugify(title)
        slug = base_slug
        counter = 1
        while db.query(Post).filter(Post.slug == slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1

        # 3. Create the Post row
        new_post = Post(
            title=title,
            content=content,
            slug=slug,
            author_id=author_id,
            category_id=category_id,
            thumbnail_url=image_url,
        )
        db.add(new_post)
        db.flush()  # get new_post.id

        # 4. Upsert Tags and create PostTag join rows
        tag_objects = _upsert_tags(db, tags)
        for tag in tag_objects:
            db.add(PostTag(post_id=new_post.id, tag_id=tag.id))
            # Increment tag.post_count
            tag.post_count = (tag.post_count or 0) + 1

        db.commit()
        db.refresh(new_post)

        # 5. AI summary in background
        bg_tasks.add_task(PostRepository._enrich_post_with_summary, new_post.id, content)

        return new_post

    # ------------------------------------------------------------------ #
    #  READ                                                                #
    # ------------------------------------------------------------------ #
    @staticmethod
    def fetch_all_posts(db: Session, skip: int = 0, limit: int = 20) -> List[Post]:
        return db.query(Post).offset(skip).limit(limit).all()

    @staticmethod
    def fetch_post_by_id(db: Session, post_id: int) -> Post:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return post

    @staticmethod
    def fetch_post_by_slug(db: Session, slug: str) -> Post:
        post = db.query(Post).filter(Post.slug == slug).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return post

    @staticmethod
    def search_posts(db: Session, query: str, skip: int = 0, limit: int = 10) -> List[Post]:
        pattern = f"%{query}%"
        return (
            db.query(Post)
            .filter(
                Post.title.ilike(pattern)
                | Post.content.ilike(pattern)
                | Post.summary.ilike(pattern)
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ------------------------------------------------------------------ #
    #  PERSONALIZED FEED                                                   #
    # ------------------------------------------------------------------ #
    @staticmethod
    def fetch_feed_for_user(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 20,
    ) -> List[Post]:
        """
        Returns posts ranked by the user's tag interest scores.
        Posts whose tags the user has interacted with most appear first.
        Falls back to recency for posts with no matching tags.
        """
        # Sum of the user's interest scores across each post's tags.
        # PostTag stores tag names as strings; join through Tag.name to get Tag.id
        # for matching UserInterest.tag_id.
        interest_score = (
            db.query(Post.id, func.coalesce(func.sum(UserInterest.score), 0).label("score"))
            .outerjoin(PostTag, PostTag.post_id == Post.id)
            .outerjoin(Tag, Tag.name == PostTag.tag)
            .outerjoin(
                UserInterest,
                (UserInterest.tag_id == Tag.id) & (UserInterest.user_id == user_id),
            )
            .filter(Post.is_active == True)
            .group_by(Post.id)
            .subquery()
        )

        posts = (
            db.query(Post)
            .join(interest_score, interest_score.c.id == Post.id)
            .order_by(interest_score.c.score.desc(), Post.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        return posts

    # ------------------------------------------------------------------ #
    #  DELETE                                                              #
    # ------------------------------------------------------------------ #
    @staticmethod
    def delete_post(db: Session, post_id: int, author_id: int) -> dict:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if post.author_id != author_id:
            raise HTTPException(status_code=403, detail="Not allowed to delete this post")

        # Decrement post_count on each associated tag
        for pt in post.post_tags:
            if pt.tag and pt.tag.post_count > 0:
                pt.tag.post_count -= 1

        db.delete(post)
        db.commit()
        return {"detail": "Post deleted successfully"}

    # ------------------------------------------------------------------ #
    #  ENGAGEMENT HELPERS                                                  #
    # ------------------------------------------------------------------ #
    @staticmethod
    def record_like(db: Session, user_id: int, post: Post):
        """Call this when a user likes a post to update their tag interests."""
        tags = [pt.tag for pt in post.post_tags if pt.tag]
        _bump_user_interests(db, user_id, tags, increment=2.0)
        db.commit()

    @staticmethod
    def record_view(db: Session, user_id: int, post: Post):
        """Call this when a user reads a post to gently update their interests."""
        tags = [pt.tag for pt in post.post_tags if pt.tag]
        _bump_user_interests(db, user_id, tags, increment=0.5)
        post.view_count = (post.view_count or 0) + 1
        db.commit()

    # ------------------------------------------------------------------ #
    #  BACKGROUND TASK                                                     #
    # ------------------------------------------------------------------ #
    @staticmethod
    def _enrich_post_with_summary(post_id: int, content: str):
        summary = generate_summary(content)
        if summary:
            from app.db.session import SessionLocal
            with SessionLocal() as db:
                db.query(Post).filter(Post.id == post_id).update({"summary": summary})
                db.commit()
        else:
            print(f"[AI] Failed to generate summary for post {post_id}")
