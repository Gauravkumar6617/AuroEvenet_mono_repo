from fastapi import APIRouter,HTTPException,status,Depends
from  sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.userModel import User
from app.schemas.aiSchema import EnchanceRequest as EnhanceRequest,EnhanceResponse,SuggestTagRequest,SuggestTagResponse,TopicWeightUpdate,TopicResponse
from app.repositories.aiRepositories import AiRepository as AiRepositorires
from app.service.aiService import (
    summarize_comments,
    summarize_debate,
    enchace_post,
    suggest_tags,
    generate_related_questions,
)
from app.core.ratelimit import check_rate_limit
from app.core.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/ai", tags=["AI features"])


####to get comment summary
@router.get("/posts/{post_id}/comment-summary")
def get_comment_summary(post_id: int, db: Session = Depends(get_db)):
    check_rate_limit(User.id,"comment-summary",max_calls=4,window_seconds=60)
    comments = AiRepositorires.get_comment_texts(db, post_id)
    return {"summary": summarize_comments(comments)}

####to get debate summary
@router.get("/posts/{post_id}/debate-summary")
def get_debate_summary(post_id: int, db: Session = Depends(get_db)):
    check_rate_limit(User.id,"debate-summary",max_calls=4,window_seconds=60)
    comments = AiRepositorires.get_comment_texts(db, post_id)
    return {"summary": summarize_debate(comments)}

####to enhance draft
@router.post("/enhance-draft", response_model=EnhanceResponse)
def enhance_draft(
    payload: EnhanceRequest,
    user: User = Depends(get_current_user),
):
    check_rate_limit(User.id, "enhance-draft", max_calls=5, window_seconds=60)
    return enhance_post(payload.title, payload.content)

####to get tag suggestions
@router.post("/suggest-tags", response_model=SuggestTagResponse)
def get_tag_suggestions(
    payload: SuggestTagRequest,
    user: User = Depends(get_current_user),
):
    check_rate_limit(User.id, "suggest-tags", max_calls=30, window_seconds=60)
    return {"suggested_tags": suggest_tags(payload.title, payload.preview)}

####to get related questions
@router.get("/posts/{post_id}/related-questions")
def get_related_questions(
    post_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    check_rate_limit(User.id, "related-questions", max_calls=20, window_seconds=60)
    post = AiRepositorires.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"questions": generate_related_questions(post.title, post.content)}



    ############ai topic endpoints############
    
@router.get("/me/topics", response_model=List[TopicResponse])
def get_my_topics(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    interests = AiRepositorires.get_user_interests(db,  user.id)
    return [
        {"tag_id": i.tag_id, "tag_name": i.tag.name if i.tag else None, "weight": i.score}
        for i in interests
    ]


@router.post("/me/topics")
def add_topic(
    payload: TopicWeightUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    tag = AiRepositorires.get_tag_by_id(db, payload.topic_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    AiRepositorires.upsert_user_interest(db,    User.id, payload.topic_id, payload.weight)
    return {"detail": "Topic preference updated"}


@router.delete("/me/topics/{topic_id}")
def remove_topic(
    topic_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    AiRepositorires.delete_user_interest(db, User.id, topic_id)
    return {"detail": "Topic removed"}