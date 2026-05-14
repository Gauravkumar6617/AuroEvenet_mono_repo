from pydantic import EmailStr, BaseModel

class ContactSchema(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactResponse(ContactSchema):
    id: int
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True