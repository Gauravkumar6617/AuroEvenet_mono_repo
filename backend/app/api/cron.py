from fastapi import APIRouter, HTTPException
import threading
from app.tasks.decay_trending import decay_all_scores
from app.core.config import settings
import redis

router = APIRouter(prefix="/tasks", tags=["Cron Tasks"])

r = redis.from_url(settings.Redis_URL)

@router.post("/decay")
def run_decay(token: str):
    """
    Run decay task manually.
    Usage: POST /tasks/decay?token=your_secret
    """
    if token != settings.CRON_SECRET:
        raise HTTPException(status_code=403)

    # acquire lock
    if not r.set("decay_lock", "1", nx=True, ex=3600):
        return {"status": "already running"}

    def task():
        try:
            decay_all_scores()
        finally:
            r.delete("decay_lock")

    threading.Thread(target=task).start()
    return {"status": "started"}