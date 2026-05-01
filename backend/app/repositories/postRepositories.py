from app.models.postModel import Post, Tag
from app.models.userModel import User
import cloudinary
import cloudinary.uploader
from typing import List, Optional
from sqlalchemy.orm import Session
from slugify import slugify
from app.schemas.postSchema import PostCreate
from fastapi import HTTPException , UploadFile,BackgroundTasks ,Depends
from app.core.config import settings
from app.service.aiService import generate_summary


# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


class PostRepository:
    @staticmethod
    def create_post(db: Session, title: str, content: str, author_id: int, category_id: int, tags: List[str], image: UploadFile, bg_tasks: BackgroundTasks):
        
        # 1. Slug generation
        base_slug = slugify(title)
        
        # 2. Cloudinary upload
        try:
            # We use image.file here - Ensure 'image' is actually an UploadFile
            upload_result = cloudinary.uploader.upload(
                image.file, 
                folder="blogbyte/posts",
                transformation={
                    "width": 800, 
                    "height": 450, 
                    "crop": "fill"
                }
            )
            image_url = upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

        # 3. Create Post Instance
        new_post = Post(
            title=title,
            content=content,
            slug=base_slug,
            author_id=author_id,
            category_id=category_id,
            thumbnail_url=image_url
        )   
        
        # 4. Handle Tags (Optimized)
        clean_tag_names = [t.lower().strip() for t in tags]
        existing_tags = db.query(Tag).filter(Tag.name.in_(clean_tag_names)).all()
        existing_tag_map = {t.name: t for t in existing_tags}

        for name in clean_tag_names:
            if name in existing_tag_map:
                new_post.tags.append(existing_tag_map[name])
            else:
                new_tag = Tag(name=name, slug=slugify(name))
                db.add(new_tag)
                new_post.tags.append(new_tag)

        db.add(new_post)
        db.commit() # Commit ONCE after everything is added
        db.refresh(new_post)

        # 5. Trigger AI Summary in Background
        bg_tasks.add_task(PostRepository.enrich_post_with_summary, new_post.id, content)

        return new_post
     
    @staticmethod
    def enrich_post_with_summary(post_id: int, content: str):
        summary = generate_summary(content)
        if summary:
            # Note: Ensure your import path for SessionLocal is correct
            from app.db.session import SessionLocal 
            with SessionLocal() as db:
                db.query(Post).filter(Post.id == post_id).update({"summary": summary})
                db.commit() # Correct: commit() doesn't take arguments
        else:
            print(f"Failed to generate summary for post {post_id}")
    
    def fetch_all_post(db: Session,):
        return db.query(Post).all()
    

    def fetch_post_by_id(db:Session,post_id=int):
        return db.query(Post).filter(Post.id == post_id).first()
    

    
    def fetch_post_by_slug(db:Session,slug:str):
        return db.query(Post).filter(Post.slug == slug).first()
    



    