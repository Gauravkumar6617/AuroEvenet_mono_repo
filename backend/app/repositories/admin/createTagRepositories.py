from sqlalchemy.orm import Session
from app.models.admin.createTagsModel import CreateTags
from app.schemas.admin.createTagScehma import CreateTagCreate, CreateTagRead

class CreateTagRepositories:
    @staticmethod
    def create_tag(db: Session, tag: CreateTagCreate):
        new_tag = CreateTags(name=tag.name, description=tag.description)
        db.add(new_tag)
        db.commit()
        db.refresh(new_tag)
        return new_tag