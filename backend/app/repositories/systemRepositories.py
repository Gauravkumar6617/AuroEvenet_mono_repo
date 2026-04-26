from app.core.config import settings
from app.db.session import get_db
from sqlalchemy.orm import Session
from sqlalchemy import text
def db_status():
    try:
        db = next(get_db())
        db.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
