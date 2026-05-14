from fastapi import HTTPException
from app.repositories.contactRepositories import ContactRepository
from app.schemas.contactSchema import ContactSchema, ContactResponse
from app.service.EmailService import EmailService
from sqlalchemy.orm import Session


class ContactService:

    @staticmethod
    def create_contact(db: Session, contact: ContactSchema) -> ContactResponse:
        try:
            # Save contact
            created_contact = ContactRepository.create_contact(db, contact)

            # Send email
            try:
                EmailService.send_contact_email(
                    sender_name=contact.name,
                    sender_email=contact.email,
                    subject=contact.subject,
                    message=contact.message
                )
            except Exception as mail_error:
                print(f"Email sending failed: {mail_error}")

            return created_contact

        except Exception as e:
            print(f"Error creating contact: {e}")

            raise HTTPException(
                status_code=500,
                detail=f"Error creating contact: {str(e)}"
            )