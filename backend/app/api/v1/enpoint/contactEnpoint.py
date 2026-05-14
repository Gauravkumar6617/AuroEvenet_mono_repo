from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db

from app.schemas.contactSchema import ContactSchema, ContactResponse
from app.service.contactService import ContactService

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact(contact: ContactSchema, db: Session = Depends(get_db)):
    return ContactService.create_contact(db, contact)