"""Public read-only routes for Categories."""

from fastapi import APIRouter, HTTPException, status ,Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.category import Category
from app.schemas.admin.category import CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/", response_model=list[CategoryResponse])
def list_public_categories(db: Session =Depends(get_db) ):
    """Return all active, non-deleted categories (public)."""
    return (
        db.query(Category)
        .filter(Category.is_active == True, Category.is_deleted == False)
        .all()
    )


@router.get("/{category_id}", response_model=CategoryResponse)
def get_public_category(category_id: int, db: Session = Depends(get_db)):
    """Return a single category by ID (public)."""
    category = (
        db.query(Category)
        .filter(
            Category.id == category_id,
            Category.is_active == True,
            Category.is_deleted == False,
        )
        .first()
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    return category
