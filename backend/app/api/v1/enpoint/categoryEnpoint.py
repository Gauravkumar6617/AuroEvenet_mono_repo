from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.categoryScehma import CategoryCreate, CategoryRead
from app.repositories.categoryRepositories import CreateCategory 
from app.core.dependencies import verify_internal_api_key

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
@router.get("/", response_model=list[CategoryRead])
async def fetch_all_categories(db: Session = Depends(get_db) ,_:str = Depends(verify_internal_api_key)):
    try:
        categories = CreateCategory.fetch_all_categories(db)
        return categories
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching categories: {str(e)}"
        )
@router.post("/{category_id}", response_model=CategoryRead)
async def fetch_category_by_id(category_id: int, db: Session = Depends(get_db)):
    try:
        category = CreateCategory.fetch_category_by_id(db, category_id) 
        return category
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching category: {str(e)}"
        )

@router.delete("/{category_id}")
async def delete_category(category_id: int, db: Session = Depends(get_db)):
    try:
        category=CreateCategory.delete_category(db, category_id)
        return category
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting category: {str(e)}"
        )   