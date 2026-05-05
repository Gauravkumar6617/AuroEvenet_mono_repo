from fastapi import APIRouter,HTTPException,status ,Depends
from app.schemas.readingHistorySchema import TrackHistoryRequest
from typing import List 
from app.models.readingHistoryModel import ReadingHistory
from app.db.session import get_db
from app.models.userModel import User

router=APIRouter(prefix="/reading-history",tags=["Reading History"])





        
    
   
  