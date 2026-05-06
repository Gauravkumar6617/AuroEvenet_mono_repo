from telnetlib import STATUS
from sqlalchemy.orm import Session
from typing import List
from slugify import slugify
from app.repositories.communityRepositories import CommunityRepositories as CommunityRepository 
from app.models.communityModel import Community
from fastapi import HTTPException, status, UploadFile
from typing import List, Optional

class CommunityService:


###to create commnurity 
    @staticmethod
    async def create(
        db: Session, 
        name: str, 
        description: Optional[str], 
        rules: Optional[str], 
        tags: Optional[str], 
        icon_image: Optional[UploadFile],
        user_id: int
    ) -> Community:
        slug = slugify(name)
        if CommunityRepository.check_slug_exists(db, slug):
            raise HTTPException(status_code=400, detail="Community with this name already exists")
        
        return CommunityRepository.create_community(
            db=db,
            name=name,
            slug=slug,
            rules=rules,
            description=description,
            created_by_id=user_id,
            icon_image=icon_image,
            tags=tags
        )
    
### to get all by active
    @staticmethod
    def get_all(db:Session,skip:int,limit:int=100, user_id:Optional[int] = None)->List[Community]:
        try:
            data = CommunityRepository.get_by_active(db, skip, limit)
            if user_id and data:
                for c in data:
                    c.joined = bool(CommunityRepository.get_members(db, c.id, user_id))
            return data or []  
        except Exception:
            return []

    ###check by slug
    @staticmethod
    def get(db: Session, slug: str, user_id: Optional[int] = None) -> Community:
        community = CommunityRepository.get_by_slug(db, slug)
        if not community:
            raise HTTPException(status_code=404, detail="Community not found")
        if user_id:
            community.joined = bool(CommunityRepository.get_members(db, community.id, user_id))
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





    

   
  