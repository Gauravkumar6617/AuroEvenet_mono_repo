from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.schemas.likeScehma import LikeBase,LikeCreate,LikeRead
from app.repositories.likeRepositories import LikeRepositorires
from app.core.dependencies import get_current_user, get_optional_user
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.userModel import User
from typing import Optional

router = APIRouter(
    prefix="/likes",
    tags=["Likes"]
)

class ToggleLikeRequest(BaseModel):
    post_id: int

class LikeCountResponse(BaseModel):
    count: int
    liked: Optional[bool] = False

class LikeCountBatchRequest(BaseModel):
    post_ids: list[int]

class LikeCountBatchItem(BaseModel):
    post_id: int
    count: int
    liked: Optional[bool] = False

@router.post("/", response_model=LikeRead)
async def create_like(like: LikeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return LikeRepositorires.create_like(db, like)

@router.post("/toggle", response_model=Optional[LikeRead])
async def toggle_like(request: ToggleLikeRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = LikeRepositorires.toggle_like(db, current_user.id, request.post_id)
    return result

@router.get("/count/{post_id}", response_model=LikeCountResponse)
async def get_like_count(post_id: int, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_optional_user)):
    count = LikeRepositorires.get_like_count_for_post(db, post_id)
    liked = False
    if current_user:
        liked = LikeRepositorires.is_post_liked_by_user(db, current_user.id, post_id)
    return LikeCountResponse(count=count, liked=liked)

@router.post("/counts", response_model=list[LikeCountBatchItem])
async def get_like_counts(request: LikeCountBatchRequest, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_optional_user)):
    post_ids = list(dict.fromkeys(request.post_ids))
    if not post_ids:
        return []

    counts = LikeRepositorires.get_like_counts_for_posts(db, post_ids)
    liked_posts = {}
    if current_user:
        liked_posts = LikeRepositorires.get_liked_posts_for_user(db, current_user.id, post_ids)

    return [
        LikeCountBatchItem(
            post_id=post_id,
            count=counts.get(post_id, 0),
            liked=liked_posts.get(post_id, False),
        )
        for post_id in post_ids
    ]

@router.get("/check/{post_id}")
async def check_liked(post_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    liked = LikeRepositorires.is_post_liked_by_user(db, current_user.id, post_id)
    return {"liked": liked}

@router.get("/", response_model=list[LikeRead])
async def fetch_all_likes(db: Session = Depends(get_db)):
    return LikeRepositorires.fetch_all_likes(db)

@router.get("/{like_id}", response_model=LikeRead)
async def fetch_like_by_id(like_id: int, db: Session = Depends(get_db)):
    return LikeRepositorires.fetch_like_by_id(db, like_id)
