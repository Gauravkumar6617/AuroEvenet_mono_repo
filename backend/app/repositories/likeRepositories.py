from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.cache import cache_delete, cache_get_json, cache_set_json
from app.models.likeModel import Like
from app.schemas.likeScehma import LikeCreate, LikeRead

LIKE_CACHE_TTL_SECONDS = 120


def _like_count_cache_key(post_id: int) -> str:
    return f"likes:count:{post_id}"


def _user_like_cache_key(user_id: int, post_id: int) -> str:
    return f"likes:user:{user_id}:post:{post_id}"


def _invalidate_like_cache(post_id: int, user_id: int | None = None) -> None:
    keys = [_like_count_cache_key(post_id)]
    if user_id is not None:
        keys.append(_user_like_cache_key(user_id, post_id))
    cache_delete(*keys)


class LikeRepositorires:
    @staticmethod
    def create_like(db: Session, like: LikeCreate):
        new_like = Like(
            post_id=like.post_id,
            user_id=like.user_id
        )
        db.add(new_like)
        db.commit()
        db.refresh(new_like)
        _invalidate_like_cache(new_like.post_id, new_like.user_id)
        return new_like
    
    def fetch_all_likes(db: Session):
        return db.query(Like).all()
    
    def fetch_like_by_id(db: Session, like_id: int):
        return db.query(Like).filter(Like.id == like_id).first()
    
    def fetch_like_by_post_id(db: Session, post_id: int):
        return db.query(Like).filter(Like.post_id == post_id).all()
    
    def fetch_like_by_user_and_post(db: Session, user_id: int, post_id: int):
        return db.query(Like).filter(Like.user_id == user_id, Like.post_id == post_id).first()
    
    def delete_like(db: Session, like_id: int):
        like = db.query(Like).filter(Like.id == like_id).first()
        if like:
            post_id = like.post_id
            user_id = like.user_id
            db.delete(like)
            db.commit()
            _invalidate_like_cache(post_id, user_id)
        return like
    
    def toggle_like(db: Session, user_id: int, post_id: int):
        existing_like = db.query(Like).filter(Like.user_id == user_id, Like.post_id == post_id).first()
        if existing_like:
            db.delete(existing_like)
            db.commit()
            _invalidate_like_cache(post_id, user_id)
            return None
        else:
            new_like = Like(user_id=user_id, post_id=post_id)
            db.add(new_like)
            db.commit()
            db.refresh(new_like)
            _invalidate_like_cache(post_id, user_id)
            return new_like
    
    def get_like_count_for_post(db: Session, post_id: int):
        cache_key = _like_count_cache_key(post_id)
        cached_count = cache_get_json(cache_key)
        if cached_count is not None:
            return int(cached_count)

        count = db.query(Like).filter(Like.post_id == post_id).count()
        cache_set_json(cache_key, count, LIKE_CACHE_TTL_SECONDS)
        return count

    def get_like_counts_for_posts(db: Session, post_ids: list[int]) -> dict[int, int]:
        unique_post_ids = list(dict.fromkeys(post_ids))
        counts: dict[int, int] = {}
        missing_post_ids: list[int] = []

        for post_id in unique_post_ids:
            cached_count = cache_get_json(_like_count_cache_key(post_id))
            if cached_count is None:
                missing_post_ids.append(post_id)
            else:
                counts[post_id] = int(cached_count)

        if missing_post_ids:
            rows = (
                db.query(Like.post_id, func.count(Like.id))
                .filter(Like.post_id.in_(missing_post_ids))
                .group_by(Like.post_id)
                .all()
            )
            fresh_counts = {post_id: 0 for post_id in missing_post_ids}
            fresh_counts.update({post_id: int(count) for post_id, count in rows})

            for post_id, count in fresh_counts.items():
                counts[post_id] = count
                cache_set_json(_like_count_cache_key(post_id), count, LIKE_CACHE_TTL_SECONDS)

        return counts

    def is_post_liked_by_user(db: Session, user_id: int, post_id: int) -> bool:
        cache_key = _user_like_cache_key(user_id, post_id)
        cached_liked = cache_get_json(cache_key)
        if cached_liked is not None:
            return bool(cached_liked)

        liked = (
            db.query(Like.id)
            .filter(Like.user_id == user_id, Like.post_id == post_id)
            .first()
            is not None
        )
        cache_set_json(cache_key, liked, LIKE_CACHE_TTL_SECONDS)
        return liked

    def get_liked_posts_for_user(db: Session, user_id: int, post_ids: list[int]) -> dict[int, bool]:
        unique_post_ids = list(dict.fromkeys(post_ids))
        likes: dict[int, bool] = {}
        missing_post_ids: list[int] = []

        for post_id in unique_post_ids:
            cached_liked = cache_get_json(_user_like_cache_key(user_id, post_id))
            if cached_liked is None:
                missing_post_ids.append(post_id)
            else:
                likes[post_id] = bool(cached_liked)

        if missing_post_ids:
            liked_post_ids = {
                post_id
                for (post_id,) in (
                    db.query(Like.post_id)
                    .filter(Like.user_id == user_id, Like.post_id.in_(missing_post_ids))
                    .all()
                )
            }

            for post_id in missing_post_ids:
                liked = post_id in liked_post_ids
                likes[post_id] = liked
                cache_set_json(_user_like_cache_key(user_id, post_id), liked, LIKE_CACHE_TTL_SECONDS)

        return likes
    
