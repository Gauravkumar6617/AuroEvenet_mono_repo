import sqlalchemy as sa
from sqlalchemy import func
from sqlalchemy.orm import Session
import cloudinary
import cloudinary.uploader
from app.core.config import settings
from fastapi import UploadFile, HTTPException
from app.models.communityModel import Community , CommunityMember
from app.schemas.communitySchema import CommunityResponse, CommunityMemberResponse
from typing import Optional
from typing import List
class CommunityRepositories:

    ##get by slug
    @staticmethod
    def get_by_slug(db: Session, slug: str)->Optional[Community]:
        try:
            return db.query(Community).filter(Community.slug == slug).first()
        except Exception as e:
            print(f"Error getting community by slug: {e}")
            return None

    ##to get by id
    @staticmethod
    def get_by_id(db: Session, id: int)->Optional[Community]:
        try:
            return db.query(Community).filter(Community.id == id).first()
        except Exception as e:
            print(f"Error getting community by id: {e}")
            return None
    
    #to to check is already slugs existed or not 
    @staticmethod
    def check_slug_exists(db:Session,slug:str)->bool:
        try:
            return db.query(Community).filter(Community.slug == slug).first() is not None
        except Exception as e:
            print(f"Error checking if slug exists: {e}")
            return False

    @staticmethod
    def _init_cloudinary():
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
        )

    @staticmethod
    def create_community(db: Session, name:str,description:str,slug:str,rules:str,created_by_id:int, icon_image:UploadFile = None, tags:str = None):
        CommunityRepositories._init_cloudinary()
        icon_url = None
        if icon_image:
            try:
                upload_result = cloudinary.uploader.upload(
                    icon_image.file,
                    folder="blogbyte/communities",
                    transformation={"width": 128, "height": 128, "crop": "fill"},
                )
                icon_url = upload_result.get("secure_url")
            except Exception as e:
                print(f"Icon upload failed: {e}")
                # Optional: continue with icon_url = None, or raise

        try:
            db_community = Community(name=name,description=description,slug=slug,rules=rules,created_by_id=created_by_id,members_count=1, icon_url=icon_url, tags=tags)
            db.add(db_community)
            db.flush()  # Get the ID without committing
            db.add(CommunityMember(community_id=db_community.id, user_id=created_by_id, role="admin"))
            db.commit()
            db.refresh(db_community)
            return db_community
        except Exception as e:
            db.rollback()
            print(f"Error creating community: {e}")
            raise e

    ####get only active communities
    @staticmethod
    def get_by_active(db:Session ,skip:int=0 ,limit:int=100):
      try:
        return db.query(Community).filter(Community.is_active == True).offset(skip).limit(limit).all()
      except Exception as e:
        print(f"Error getting active communities: {e}")
        return None
    
    ###get all members of a community (optionally filter by user_id)
    @staticmethod
    def get_members(db: Session, community_id: int, user_id: Optional[int] = None) -> List[CommunityMember]:
        try:
            query = db.query(CommunityMember).filter(CommunityMember.community_id == community_id)
            if user_id is not None:
                query = query.filter(CommunityMember.user_id == user_id)
            return query.all()
        except Exception as e:
            print(f"Error getting community member: {e}")
            return []
    ###to add memeber consurrently
    @staticmethod
    def add_member(db:Session,community_id:int,user_id:int)->None:
        try:
            db.add(CommunityMember(community_id=community_id, user_id=user_id, role="member"))

            ##
            db.query(Community).filter(Community.id == community_id).update({"members_count": Community.members_count + 1},synchronize_session="fetch")
            db.commit()
        except Exception as e:
            print(f"Error adding member: {e}")
            return None
    

    @staticmethod
    def remove_member(db: Session, community_id: int, user_id: int) -> bool:
        deleted = (
            db.query(CommunityMember)
            .filter(
                CommunityMember.community_id == community_id,
                CommunityMember.user_id == user_id,
            )
            .delete(synchronize_session="fetch")
        )
        if deleted:
            # ✅ Atomic decrement, floor at 0
            db.query(Community).filter(Community.id == community_id).update(
                {Community.members_count: func.greatest(Community.members_count - 1, 0)},
                synchronize_session="fetch",
            )
            db.commit()
        return deleted > 0

    
       