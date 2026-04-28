from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.repositories.postRepositories import PostRepository
from app.schemas.postSchema import PostRead

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.post("/", response_model=PostRead,)
async def create_post(
    bg_tasks: BackgroundTasks,
    title: str = Form(...),
    content: str = Form(...),
    category_id: int = Form(...),
    tags: str = Form(""), # Send as "ai, tech, python"
    thumbnail: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    tag_list = [t.strip() for t in tags.split(",")] if tags else []
    
   # Use 10 to match your actual Supabase User ID
    current_user_id = 10 

    return PostRepository.create_post(
        db=db, 
        title=title, 
        content=content, 
        author_id=current_user_id, 
        category_id=category_id, 
        tags=tag_list, 
        image=thumbnail, 
        bg_tasks=bg_tasks
    )