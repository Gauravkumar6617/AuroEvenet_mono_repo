
from sqlalchemy.orm import Session
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
    
    def fetch_all_categories(db: Session):
        return db.query(Category).all()
    
    def fetch_category_by_id(db: Session, category_id: int):
        return db.query(Category).filter(Category.id == category_id).first()
    
    def fetch_category_by_slug(db: Session, slug: str):
        return db.query(Category).filter(Category.slug == slug).first()
    
    def delete_category(db:Session ,category_id:int):
        return db.query(Category).filter(Category.id == category_id).delete()
    


