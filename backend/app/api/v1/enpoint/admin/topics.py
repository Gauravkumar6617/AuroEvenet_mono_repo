"""Superadmin CRUD routes for Topics."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import require_super_admin
from app.models.userModel import User
from app.models.category import Category
from app.models.topicModel import Topic

from app.schemas.admin.topic import TopicCreate, TopicUpdate, TopicResponse

router = APIRouter(
    prefix="/admin/topics",
    tags=["Superadmin Topics"],
)


@router.post("", response_model=TopicResponse, status_code=status.HTTP_201_CREATED)
def create_topic(
    payload: TopicCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    cat = db.query(Category).filter(Category.id == payload.category_id, Category.is_deleted == False).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    exists = db.query(Topic).filter(Topic.slug == payload.slug).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Topic with slug '{payload.slug}' already exists",
        )

    topic = Topic(**payload.model_dump())
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


@router.get("", response_model=list[TopicResponse])
def list_topics(
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    return db.query(Topic).filter(Topic.is_deleted == False).all()


@router.put("/{topic_id}", response_model=TopicResponse)
def update_topic(
    topic_id: int,
    payload: TopicUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    topic = db.query(Topic).filter(Topic.id == topic_id, Topic.is_deleted == False).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(topic, key, value)

    db.commit()
    db.refresh(topic)
    return topic


@router.delete("/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    topic = db.query(Topic).filter(Topic.id == topic_id, Topic.is_deleted == False).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")

    topic.is_deleted = True
    db.commit()
    return None
