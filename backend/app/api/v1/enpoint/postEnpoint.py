from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks, HTTPException, Security, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.postRepositories import PostRepository
from app.schemas.postSchema import PostRead
from app.models.userModel import User
from app.core.dependencies import get_current_user


router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/", response_model=PostRead)
async def create_post(
    bg_tasks: BackgroundTasks,
    title: str = Form(...),
    content: str = Form(...),
    category_id: int = Form(...),
    tags: str = Form(""),   # comma-separated: "ai, python, fastapi"
    thumbnail: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Security(get_current_user),
):
    tag_list = [t.strip() for t in tags.split(",") if t.strip()] if tags else []
    return PostRepository.create_post(
        db=db,
        title=title,
        content=content,
        author_id=current_user.id,
        category_id=category_id,
        tags=tag_list,
        image=thumbnail,
        bg_tasks=bg_tasks,
    )


@router.get("/feed", response_model=List[PostRead])
async def get_personalized_feed(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Security(get_current_user),
):
    """Returns posts ranked by the current user's tag interest scores."""
    return PostRepository.fetch_feed_for_user(db, user_id=current_user.id, skip=skip, limit=limit)


@router.get("/search", response_model=List[PostRead])
async def search_posts(
    q: str = Query(..., min_length=3, description="Search keyword"),
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    return PostRepository.search_posts(db, query=q, skip=skip, limit=limit)


@router.get("/", response_model=List[PostRead])
async def fetch_all_posts(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    return PostRepository.fetch_all_posts(db, skip=skip, limit=limit)


@router.get("/{post_id}", response_model=PostRead)
async def fetch_post_by_id(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Security(get_current_user, scopes=[]),
):
    post = PostRepository.fetch_post_by_id(db, post_id)
    # Record the view and update interests if user is logged in
    if current_user:
        PostRepository.record_view(db, current_user.id, post)
    return post


@router.get("/slug/{slug}", response_model=PostRead)
async def fetch_post_by_slug(slug: str, db: Session = Depends(get_db)):
    return PostRepository.fetch_post_by_slug(db, slug)


@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Security(get_current_user),
):
    return PostRepository.delete_post(db, post_id=post_id, author_id=current_user.id)
