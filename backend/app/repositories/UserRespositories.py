from sqlalchemy.orm import Session
from app.models.userModel import User
from app.schemas.userSchema import UserCreate
from typing import Optional

class UserRepository:
 

    def create_user(self, user_create: UserCreate, hashed_pwd: str, db: Session) -> User:
        """
        Creates a user and returns the DB Model.
        Note: We pass the hashed_pwd in from the service layer to keep 
        this function purely about database interaction.
        """
        new_user = User(
            email=user_create.email,
            username=user_create.username, # Use the username from your UserBase schema
            password_hash=hashed_pwd,
            is_active=True # Default state
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    def get_by_email(self, email: str, db: Session) -> Optional[User]:
        # Simple, fast, and uses the DB index we discussed
        return db.query(User).filter(User.email == email).first()
    
    def get_by_id(self, user_id: int, db: Session) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()