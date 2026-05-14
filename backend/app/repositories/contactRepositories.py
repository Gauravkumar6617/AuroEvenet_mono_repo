from sqlalchemy.orm import Session
from app.models.contactModel import Contact
from app.schemas.contactSchema import ContactSchema, ContactResponse

class ContactRepository:

    @staticmethod
    def create_contact(db: Session, contact: ContactSchema) -> ContactResponse:
        db_contact = Contact(
            name=contact.name,
            email=contact.email,
            subject=contact.subject,
            message=contact.message
        )
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return ContactResponse.model_validate(db_contact)