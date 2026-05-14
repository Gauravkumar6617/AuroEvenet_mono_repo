from sqlalchemy.orm import Session
from app.models.contactModel import Contact
from app.schemas.contactSchema import ContactSchema, ContactResponse

class ContactRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create_contact(self, contact: ContactSchema) -> ContactResponse:
        db_contact = Contact(
            name=contact.name,
            email=contact.email,
            subject=contact.subject,
            message=contact.message
        )
        self.db.add(db_contact)
        self.db.commit()
        self.db.refresh(db_contact)
        return ContactResponse.model_validate(db_contact)