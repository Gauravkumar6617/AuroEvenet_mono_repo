from fastapi import APIRouter
from app.repositories.systemRepositories import db_status
from app.core.dependencies import verify_internal_api_key
from app.core.config import settings
from fastapi import Depends     
router = APIRouter(prefix="/system", tags=["System"])   

@router.get("/health")
def health_check(_: str = Depends(verify_internal_api_key)):
    if db_status()["status"] == "ok":
        return {"status": "ok"}
    else:
        return {"status": "error", "message": db_status()["message"]}   