from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.likeScehma import LikeBase,LikeCreate,LikeRead
from app.repositories.likeRepositories import LikeRepositorires
from app.core.dependencies import get_current_user
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.userModel import User

router = APIRouter(
    prefix="/likes",
    tags=["Likes"]
)
@router.post("/", response_model=LikeRead)
async def create_like(like: LikeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return LikeRepositorires.create_like(db, like)

@router.get("/", response_model=list[LikeRead])
async def fetch_all_likes(db: Session = Depends(get_db)):
    return LikeRepositorires.fetch_all_likes(db)

@router.get("/{like_id}", response_model=LikeRead)
async def fetch_like_by_id(like_id: int, db: Session = Depends(get_db)):
    return LikeRepositorires.fetch_like_by_id(db, like_id)