from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks ,HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.repositories.postRepositories import PostRepository
from app.schemas.postSchema import PostRead
from app.core.dependencies import verify_internal_api_key

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

@router.get("/", response_model=list[PostRead])
async def fetch_all_post(db: Session = Depends(get_db),_str=Depends(verify_internal_api_key)):
    try:
        posts = PostRepository.fetch_all_post(db)
        return posts
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching posts: {str(e)}")

@router.get("/{post_id}", response_model=PostRead)
async def fetch_post_by_id(post_id: int, db: Session = Depends(get_db)):
    try:
        post = PostRepository.fetch_post_by_id(db, post_id)
        return post
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching post: {str(e)}")   

@router.get("/slug/{slug}", response_model=PostRead)
async def fetch_post_by_slug(slug: str, db: Session = Depends(get_db)):
    try:
        post = PostRepository.fetch_post_by_slug(db, slug)
        return post
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching post: {str(e)}")    
@router.delete("/{post_id}")
async def delete_post(post_id: int, db: Session = Depends(get_db)):
    try:
        post=PostRepository.delete_post(db, post_id)
        return post
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting post: {str(e)}      )"
        )
    