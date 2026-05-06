from telnetlib import STATUS
from sqlalchemy.orm import Session
from typing import List
from slugify import slugify
from app.repositories.communityRepositories import CommunityRepositories as CommunityRepository 
from app.models.communityModel import Community
from app.schemas.communitySchema import CommunityResponse, CommunityMemberResponse
from fastapi import HTTPException ,status

class CommunityService:


###to create commnurity 
    @staticmethod
    def create(db: Session,  payload: CommunityResponse , user_id: int,) -> Community:
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
            data = CommunityRepository.get_by_active(db, skip, limit)
            return data or []  
        except Exception:
            return []

    ###check by slug
    @staticmethod
    def get(db: Session, slug: str) -> Community:
        community = CommunityRepository.get_by_slug(db, slug)
        if not community:
            raise HTTPException(status_code=404, detail="Community not found")
        return community
###to join community
    @staticmethod
    def join(db:Session,slug:str,user_id:int)->None:
        community=CommunityService.get(db,slug)
        if CommunityRepository.get_members(db,community.id,user_id):
            raise HTTPException(status_code=400,detail="ALready join")
        CommunityRepository.add_member(db,community.id,user_id)

    ###to get community members
    @staticmethod
    def get_community_members(db: Session, slug: str):
        community = CommunityService.get(db, slug)
        return CommunityRepository.get_members(db, community.id)

    ###to remove user
    @staticmethod
    def remove(db: Session, slug: str, user_id: int) -> None:
        community = CommunityService.get(db, slug)
        deleted = CommunityRepository.remove_member(db, community.id, user_id)
        if not deleted:
            raise HTTPException(status_code=400, detail="Not a member of this community")





    

   
  