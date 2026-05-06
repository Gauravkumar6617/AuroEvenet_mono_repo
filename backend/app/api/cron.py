from fastapi import FastAPI, HTTPException
import os
import threading
from app.tasks.decay_trending import decay_all_scores
from app.core.config import settings
app = FastAPI()

SECRET_TOKEN = settings.CRON_SECRET

@app.post("/tasks/decay")
def run_decay(token: str):
    if token != SECRET_TOKEN:
        raise HTTPException(status_code=403, detail="Unauthorized")

    # run in background (important for cron timeout)
    threading.Thread(target=decay_all_scores).start()

    return {"status": "started"}