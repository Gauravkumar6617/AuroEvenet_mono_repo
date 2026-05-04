from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.admin.createTagScehma import CreateTagCreate, CreateTagRead
from app.repositories.admin.createTagRepositories import CreateTagRepositories
from app.core.dependencies import require_super_admin
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.userModel import User

router = APIRouter(prefix="/superadmin/tags", tags=["Admin Tags"])

@router.post("/create", response_model=CreateTagRead)
async def create_tag(tag: CreateTagCreate, db: Session = Depends(get_db), _: User = Depends(require_super_admin)):
    try:
        new_tag = CreateTagRepositories.create_tag(db, tag)
        return new_tag
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating tag: {str(e)}"
        )