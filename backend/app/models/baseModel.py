from sqlalchemy import Column, Integer, DateTime, Boolean
from sqlalchemy.sql import func
from datetime import datetime, timezone
from app.db.session import Base
# Helper to ensure Python uses UTC
def get_utc_now():
    return datetime.now(timezone.utc)

class BaseModel(Base):
    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True)

    # 1. Database Server handles creation (Perfect)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 2. Python handles updates (Standard & Simple)
    # Use the helper function so the "Application Time" is always UTC
    updated_at = Column(
        DateTime(timezone=True), 
        onupdate=get_utc_now, 
        server_default=func.now()
    )

    is_deleted = Column(Boolean, default=False)