 from app.repositories.contactRepositories import ContactRepository
 from app.schemas.contactSchema import ContactSchema, ContactResponse
 from app.service.EmailService import EmailService
 from app.database import get_db
 from sqlalchemy.orm import Session


 class ContactService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ContactRepository(db)
        self.email_service = EmailService()

    def create_contact(self, contact: ContactSchema) -> ContactResponse:
        self.repository = ContactRepository(db)
        return self.repository.create_contact(contact)