"""Superadmin CRUD routes for Onboarding Questions."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import require_super_admin
from app.models.userModel import User
from app.models.topicModel import Topic
from app.models.onboardingQuestionModel import OnboardingQuestion

from app.schemas.admin.question import QuestionCreate, QuestionUpdate, QuestionResponse

router = APIRouter(
    prefix="/admin/questions",
    tags=["Superadmin Questions"],
)


@router.post("", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(
    payload: QuestionCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    topic = db.query(Topic).filter(Topic.id == payload.topic_id, Topic.is_deleted == False).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")

    question = OnboardingQuestion(**payload.model_dump())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@router.get("/{topic_id}", response_model=list[QuestionResponse])
def list_questions_by_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    return (
        db.query(OnboardingQuestion)
        .filter(
            OnboardingQuestion.topic_id == topic_id,
            OnboardingQuestion.is_deleted == False,
        )
        .all()
    )


@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: int,
    payload: QuestionUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    question = (
        db.query(OnboardingQuestion)
        .filter(OnboardingQuestion.id == question_id, OnboardingQuestion.is_deleted == False)
        .first()
    )
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(question, key, value)

    db.commit()
    db.refresh(question)
    return question


@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_super_admin),
):
    question = (
        db.query(OnboardingQuestion)
        .filter(OnboardingQuestion.id == question_id, OnboardingQuestion.is_deleted == False)
        .first()
    )
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    question.is_deleted = True
    db.commit()
    return None
