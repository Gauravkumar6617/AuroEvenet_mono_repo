from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.categoryScehma import CategoryCreate, CategoryRead
from app.repositories.categoryRepositories import CreateCategory 

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("/", response_model=CategoryRead)
async def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    try:
        new_category = CreateCategory.create_category(db, category.name)
        return new_category
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating category: {str(e)}"
        )