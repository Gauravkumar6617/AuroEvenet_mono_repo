from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.commentScehma import CommentCreate, CommentRead
from app.repositories.commentRepositories import CommentRepositorires
from app.core.dependencies import get_current_user
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.userModel import User
from typing import List, Optional
from app.models.commentModel import Comment

router = APIRouter(
    prefix="/comments",
    tags=["Comments"]
)

@router.post("/comments", response_model=CommentRead)
async def create_comment(comment: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return CommentRepositorires.create_comment(db, comment)

@router.get("/comments", response_model=List[CommentRead])
async def fetch_all_comments(post_id: int = None, db: Session = Depends(get_db)):
    if post_id:
        return db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.desc()).all()
    return CommentRepositorires.fetch_all_comments(db)