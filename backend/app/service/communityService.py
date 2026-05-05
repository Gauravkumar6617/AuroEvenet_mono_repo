from sqlalchemy.orm import Session
from typing import List
from slugify import slugify
from app.repositories.communityRepositories import CommunityRepository 
from app.models.communityModel import Community
from app.schemas.communitySchema import CreateCommunityRequest
from fastapi import HTTPException

class CommunityService:

    @staticmethod
    def create(db: Session,  payload: CreateCommunityRequest , user_id: int,) -> Community:
        slug = slugify(payload.name)
        if CommunityRepository.check_slug_exists(db, slug):
            raise HTTPException(status_code=400, detail="Community with this name already exists")
        
        return CommunityRepository.create(
            db=db,
            name=payload.name,
            slug=slug,
            rules=payload.rules,
            description=payload.description,
            created_by_id=user_id,
        )
    

    @staticmethod
    def get_all(db:Session,skip:int,limit:int=100)->List[Community]:
        try:
            return CommunityRepository.get_by_active(db,skip,limit)
        except Exception as e:
            return[]

    

   
  