import json
from app.core.cache import cache_get_json, cache_set_json,cache_delete

from sqlalchemy.orm import Session
from app.models.user import User, user_followers

def get_stats(db: Session, user_id: str):
    cache_key = f"user_stats:{user_id}"
    cached = cache_get_json(cache_key)
    if cached:
        return json.loads(cached)

    # Optimized count queries
    followers = db.query(user_followers).filter(user_followers.c.followed_id == user_id).count()
    following = db.query(user_followers).filter(user_followers.c.follower_id == user_id).count()
    
    stats = {"followers_count": followers, "following_count": following}
    cache_set_json.setex(cache_key, 1800, json.dumps(stats))
    return stats

def update_follow_relation(db: Session, follower: User, target: User):
    if target in follower.following:
        follower.following.remove(target)
        action = "unfollowed"
    else:
        follower.following.append(target)
        action = "followed"
    
    db.commit()
    return action

def clear_user_cache( user_ids: list):
    for uid in user_ids:
        cache_delete.delete(f"user_stats:{uid}")