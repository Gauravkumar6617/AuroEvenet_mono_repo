"""Super-admin system operations: cache flush, maintenance mode, session reset."""

from fastapi import APIRouter, Depends
from app.core.dependencies import require_super_admin
from app.core.cache import redis_cache, cache_delete_pattern
from app.models.userModel import User
from app.db.session import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/admin/system", tags=["Superadmin System"])

# In-memory maintenance flag (resets on server restart — good enough for dev)
_maintenance = {"enabled": False}


@router.get("/maintenance")
def get_maintenance(_: User = Depends(require_super_admin)):
    return {"enabled": _maintenance["enabled"]}


@router.post("/maintenance")
def set_maintenance(payload: dict, _: User = Depends(require_super_admin)):
    _maintenance["enabled"] = bool(payload.get("enabled", False))
    return {"enabled": _maintenance["enabled"]}


@router.post("/cache/flush")
def flush_cache(_: User = Depends(require_super_admin)):
    try:
        cache_delete_pattern("posts:*")
        cache_delete_pattern("community:*")
        cache_delete_pattern("user_stats:*")
        return {"detail": "Cache flushed successfully"}
    except Exception as e:
        return {"detail": f"Partial flush: {str(e)}"}


@router.post("/sessions/reset")
def reset_all_sessions(db: Session = Depends(get_db), _: User = Depends(require_super_admin)):
    """Delete all Redis session keys — forces all users to re-login."""
    try:
        keys = list(redis_cache.scan_iter("s:*"))
        if keys:
            redis_cache.delete(*keys)
        return {"detail": f"Revoked {len(keys)} sessions"}
    except Exception as e:
        return {"detail": f"Error: {str(e)}"}


@router.post("/db/cleanup")
def db_cleanup(db: Session = Depends(get_db), _: User = Depends(require_super_admin)):
    """Soft-delete cleanup: remove records marked is_deleted=True."""
    from app.models.postModel import Post
    from app.models.commentModel import Comment
    deleted_posts = db.query(Post).filter(Post.is_deleted == True).delete(synchronize_session=False)
    deleted_comments = db.query(Comment).filter(Comment.is_deleted == True).delete(synchronize_session=False)
    db.commit()
    cache_delete_pattern("posts:*")
    return {"detail": f"Removed {deleted_posts} posts and {deleted_comments} comments"}
