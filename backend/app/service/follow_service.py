from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.cache import cache_set_json, cache_get_json, cache_delete
from app.repositories import followRepositories as repo
from app.models.userModel import User

def handle_toggle_follow(db: Session, current_user_id: str, target_id: str):
    if current_user_id == target_id:
        raise HTTPException(status_code=400, detail="You cannot follow yourself")

    # 1. Fetch users
    current_user = db.query(User).filter(User.id == current_user_id).first()
    target_user = db.query(User).filter(User.id == target_id).first()

    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Update DB via Repo
    action = repo.update_follow_relation(db, current_user, target_user)

    # 3. Handle Cache Invalidation
    # Delete cache for both users since their stats have changed
    cache_delete(f"user_stats:{current_user_id}")
    cache_delete(f"user_stats:{target_id}")

    # 4. Get updated stats (Check cache first, then DB)
    stats = get_user_stats(db, target_id)
    
    return {
        "status": "success",
        "action": action, 
        "target_id": target_id,
        "stats": stats
    }

def get_user_stats(db: Session, user_id: str):
    cache_key = f"user_stats:{user_id}"
    
    # Try to get from cache utility
    cached_stats = cache_get_json(cache_key)
    if cached_stats:
        return cached_stats

    # If miss, get from repo
    stats = repo.get_stats_from_db(db, user_id)
    
    # Save to cache for 30 minutes (1800 seconds)
    cache_set_json(cache_key, stats, 1800)
    
    return stats