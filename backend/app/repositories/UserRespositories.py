from sqlalchemy.orm import Session
from app.models.userModel import User
from app.schemas.userSchema import UserCreate
from typing import Optional

class UserRepository:
 

    def create_user(self, user_create: UserCreate, hashed_pwd: Optional[str], db: Session) -> User:
        """
        Creates a user and returns the DB Model.
        """
        new_user = User(
            email=user_create.email,
            username=user_create.username,
            password_hash=hashed_pwd,
            auth_provider=user_create.oauth_provider.value if hasattr(user_create.oauth_provider, 'value') else user_create.oauth_provider,
            auth_provider_id=user_create.oauth_id,
            is_active=True
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

    def get_by_username(self,username:str ,db:Session) -> Optional[User]:
        """Returns a User object if found, otherwise None."""
        return db.query(User).filter(User.username == username).first()
    
    def update_password(self, email: str, hashed_password: str, db: Session) -> bool:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return False
        
        user.password_hash = hashed_password
        db.commit()
        return True