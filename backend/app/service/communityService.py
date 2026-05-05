from telnetlib import STATUS
from sqlalchemy.orm import Session
from typing import List
from slugify import slugify
from app.repositories.communityRepositories import CommunityRepository 
from app.models.communityModel import Community
from app.schemas.communitySchema import CreateCommunityRequest
from fastapi import HTTPException ,status

class CommunityService:


###to create commnurity 
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
    
### to get all by active
    @staticmethod
    def get_all(db:Session,skip:int,limit:int=100)->List[Community]:
        try:
            return CommunityRepository.get_by_active(db,skip,limit)
        except Exception as e:
            return[]

    ###chcekc by slugs
    @staticmethod
    def get(db:Session,slug:str)->Community:
        try:
            community=CommunityRepository.get_by_slug(db,slug)
            if not community:
                raise HTTPException(status_code=400,detail="community not found")
                return community
        except Exception as e:
            return {"error":"error in get of communtiy servcie"}
###to join community
    @staticmethod
    def join(db:Session,slug:str,user_id:int)->None:
        community=CommunityService.get(db,slug)
        if CommunityRepository.get_members(db,community.id,user_id):
            raise HTTPException(status_code=400,detail="ALready join")
        CommunityRepository.add_member(db,community.id,user_id)

    ###to remove user
    @staticmethod
    def remove(db:Session,slug:str,user_id:int)->None:
        try:
            community = CommunityRepository.get_members(db,slug)
            CommunityRepository.remove_member(db,community.id,user_id)
            
        except Exception as e:
            return {"failed ":"at remove"}





    

   
  