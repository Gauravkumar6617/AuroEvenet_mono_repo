import datetime
from app.models.ReadingHistoryModel import ReadingHistory
import cloudinary
import cloudinary.uploader
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import func, case
from slugify import slugify
from fastapi import HTTPException, UploadFile, BackgroundTasks

from app.core.cache import cache_delete, cache_delete_pattern, cache_get_json, cache_set_json
from app.models.postModel import Post
from app.models.postTagModel import PostTag
from app.models.tagModel import Tag
from app.models.userInterestModel import UserInterest
from app.core.config import settings
from app.schemas.postSchema import PostRead
from app.service.aiService import generate_summary


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

POST_CACHE_TTL_SECONDS = 300
POST_LIST_CACHE_TTL_SECONDS = 120


def _serialize_post(post: Post) -> dict:
    return PostRead.model_validate(post).model_dump(mode="json")


def _post_cache_key(post_id: int) -> str:
    return f"posts:detail:{post_id}"


def _post_list_cache_key(skip: int, limit: int) -> str:
    return f"posts:list:{skip}:{limit}"


def _invalidate_post_cache(post_id: int | None = None, include_lists: bool = True) -> None:
    if post_id is not None:
        cache_delete(_post_cache_key(post_id))
    if include_lists:
        cache_delete_pattern("posts:list:*")


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
        community_id: Optional[int] = None,
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
            community_id=community_id,
            thumbnail_url=image_url,
            is_active=True,
        )
        db.add(new_post)
        db.flush()  # get new_post.id

        # 4. Upsert Tags and create PostTag join rows
        tag_objects = _upsert_tags(db, tags)
        for tag in tag_objects:
            db.add(PostTag(post_id=new_post.id, tag=tag.name))
            # Increment tag.post_count
            tag.post_count = (tag.post_count or 0) + 1

        db.commit()
        db.refresh(new_post)
        _invalidate_post_cache(new_post.id)

        # 5. AI summary in background
        bg_tasks.add_task(PostRepository._enrich_post_with_summary, new_post.id, content)

        return new_post

    # ------------------------------------------------------------------ #
    #  READ                                                                #
    # ------------------------------------------------------------------ #
    @staticmethod
    def fetch_my_posts(db: Session, user_id: int, skip: int = 0, limit: int = 50) -> List[Post]:
        return (
            db.query(Post)
            .options(
                joinedload(Post.author),
                joinedload(Post.category),
                selectinload(Post.post_tags),
            )
            .filter(Post.author_id == user_id)
            .order_by(Post.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def fetch_all_posts(db: Session, skip: int = 0, limit: int = 20) -> List[dict]:
        cache_key = _post_list_cache_key(skip, limit)
        cached_posts = cache_get_json(cache_key)
        if cached_posts is not None:
            return cached_posts

        posts = (
            db.query(Post)
            .options(
                joinedload(Post.author),
                joinedload(Post.category),
                selectinload(Post.post_tags),
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
        serialized_posts = [_serialize_post(post) for post in posts]
        cache_set_json(cache_key, serialized_posts, POST_LIST_CACHE_TTL_SECONDS)
        return serialized_posts

    @staticmethod
    def fetch_post_by_id(db: Session, post_id: int, use_cache: bool = True) -> Post | dict:
        cache_key = _post_cache_key(post_id)
        if use_cache:
            cached_post = cache_get_json(cache_key)
            if cached_post is not None:
                return cached_post

        post = (
            db.query(Post)
            .options(
                joinedload(Post.author),
                joinedload(Post.category),
                selectinload(Post.post_tags),
            )
            .filter(Post.id == post_id)
            .first()
        )
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if not use_cache:
            return post

        serialized_post = _serialize_post(post)
        cache_set_json(cache_key, serialized_post, POST_CACHE_TTL_SECONDS)
        return serialized_post

    @staticmethod
    def fetch_post_by_slug(db: Session, slug: str) -> Post:
        post = db.query(Post).filter(Post.slug == slug).first()
        if not post:
            # Fallback to ID if slug is numeric
            if slug.isdigit():
                post = db.query(Post).filter(Post.id == int(slug)).first()
            
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

    # ------------------------------------------------------------------ #
    #  COMMUNITY                                                           #
    # ------------------------------------------------------------------ #
    @staticmethod
    def get_by_community(db: Session, community_id: int, skip: int = 0, limit: int = 20) -> List[Post]:
        return (
            db.query(Post)
            .filter(Post.community_id == community_id, Post.is_active == True)
            .order_by(Post.created_at.desc())
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
        cutoff = datetime.datetime.utcnow() - datetime.timedelta(hours=24)

        interest_score = (
            db.query(Post.id, func.coalesce(func.sum(UserInterest.score), 0).label("score"))
            .outerjoin(PostTag, PostTag.post_id == Post.id)
            .outerjoin(Tag, Tag.name == PostTag.tag)
            .outerjoin(
                UserInterest,
                (UserInterest.tag_id == Tag.id) & (UserInterest.user_id == user_id),
            )
            .filter(Post.is_deleted == False)
            .group_by(Post.id)
            .subquery()
        )

        recently_read = (
            db.query(ReadingHistory.post_id)
            .filter(
                ReadingHistory.user_id == user_id,
                ReadingHistory.created_at > cutoff,
            )
            .subquery()
        )

        posts = (
            db.query(Post)
            .outerjoin(interest_score, interest_score.c.id == Post.id)
            .outerjoin(recently_read, recently_read.c.post_id == Post.id)
            .filter(
                Post.is_deleted == False,
                func.coalesce(interest_score.c.score, 0) > 0,
            )
            .order_by(
                func.coalesce(interest_score.c.score, 0).desc(),
                case(
                    (recently_read.c.post_id != None, 0),
                    else_=1,
                ).desc(),
                Post.created_at.desc(),
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
        print(
            "[FeedDebug:API] personalized feed",
            {"user_id": user_id, "returned_posts": len(posts), "skip": skip, "limit": limit},
            flush=True,
        )
        return posts

    @staticmethod
    def increment_trending_score(db: Session, post: Post, delta: float) -> None:
        """Time-decayed trending score — half-life 24h so old posts fall off naturally."""
        now = datetime.datetime.now(datetime.timezone.utc)
        created = post.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=datetime.timezone.utc)

        age_hours = (now - created).total_seconds() / 3600
        decay = 0.5 ** (age_hours / 24)
        post.trending_score = (post.trending_score or 0.0) + delta * decay
        # caller must db.commit()

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

        # Decrement post_count on each associated tag (look up by name string)
        for pt in post.post_tags:
            tag = db.query(Tag).filter(Tag.name == pt.tag).first() if pt.tag else None
            if tag and tag.post_count and tag.post_count > 0:
                tag.post_count -= 1

        db.delete(post)
        db.commit()
        _invalidate_post_cache(post_id)
        return {"detail": "Post deleted successfully"}

    # ------------------------------------------------------------------ #
    #  ENGAGEMENT HELPERS                                                  #
    # ------------------------------------------------------------------ #
    @staticmethod
    def record_like(db: Session, user_id: int, post: Post):
        """Call this when a user likes a post to update their tag interests."""
        tag_names = [pt.tag for pt in post.post_tags if pt.tag]
        tags = db.query(Tag).filter(Tag.name.in_(tag_names)).all()
        _bump_user_interests(db, user_id, tags, increment=2.0)
        db.commit()

    @staticmethod
    def record_view(db: Session, user_id: int, post: Post):
        """Call this when a user reads a post to gently update their interests."""
        tag_names = [pt.tag for pt in post.post_tags if pt.tag]
        tags = db.query(Tag).filter(Tag.name.in_(tag_names)).all()
        _bump_user_interests(db, user_id, tags, increment=0.5)
        post.view_count = (post.view_count or 0) + 1
        db.commit()
        _invalidate_post_cache(post.id, include_lists=False)

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
                _invalidate_post_cache(post_id)
        else:
            print(f"[AI] Failed to generate summary for post {post_id}")
