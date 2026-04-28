from app.db.session import SessionLocal
from sqlalchemy.orm import Session
from fastapi import Depends
from slugify import slugify
from app.models.category import Category

class CreateCategory:
    @staticmethod
    def create_category( db: Session, name: str):
        base_slug = slugify(name)
        new_category = Category(name=name, slug=base_slug)
        db.add(new_category)
        db.commit()
        db.refresh(new_category)
        return new_category


