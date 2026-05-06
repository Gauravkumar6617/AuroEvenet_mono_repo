from fastapi import APIRouter ,HTTPException,status ,Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.userModel import User
from typing import List
from app.models.communityModel import Community
from app.schemas.communitySchema import CommunityResponse, CommunityMemberResponse, CommunityCreate
from app.service.communityService import CommunityService
from app.repositories.postRepositories import PostRepository
router = APIRouter(prefix="/community", tags=["Communities"])

#### to cretae community
@router.post("", status_code=status.HTTP_201_CREATED)
def create_community(payload: CommunityCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    community = CommunityService.create(db, payload, user.id)
    return {"id": community.id,"slug": community.slug}



####to get community by sluf
@router.get("/{slug}",response_model=CommunityResponse)
def get_community(slug:str,db:Session = Depends(get_db),user:User = Depends(get_current_user)):
    community = CommunityService.get(db,slug)
    return community




###to get all community
@router.get("", response_model=List[CommunityResponse])
def list_communities(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    return CommunityService.get_all(db, skip, limit)


#to get members by slug
@router.get("/{slug}/members",response_model=CommunityMemberResponse)
def get_community_members(slug:str,db:Session = Depends(get_db),user:User = Depends(get_current_user)):
    return CommunityService.get_community_members(db, slug)

####to join community
@router.post("/{slug}/join")
def join_community(
    slug: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    CommunityService.join(db, slug, user.id)
    return {"detail": "Joined"}

###to leave community
@router.delete("/{slug}/leave")
def leave_community(
    slug: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    CommunityService.remove(db, slug, user.id)
    return {"detail": "Left community"}




#to post community
@router.get("/{slug}/posts")
def get_community_posts(
    slug: str,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    community = CommunityService.get(db, slug)
    return PostRepository.get_by_community(db, community.id, skip, limit)
    
    
