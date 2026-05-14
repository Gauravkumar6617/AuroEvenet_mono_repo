from pydantic import EmailStr, BaseModel
from datetime import datetime

class ContactSchema(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactResponse(ContactSchema):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True