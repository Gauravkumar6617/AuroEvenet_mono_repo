from sqlalchemy.orm import Session
from app.models.userModel import User,user_follower # Ensure user_followers is imported

def get_stats_from_db(db: Session, user_id: str):
    """Raw DB query for counts."""
    followers = db.query(user_follower).filter(user_follower.c.followed_id == user_id).count()
    following = db.query(user_follower).filter(user_follower.c.follower_id == user_id).count()
    return {"followers_count": followers, "following_count": following}

def update_follow_relation(db: Session, follower: User, target: User):
    """Toggles the relationship in the database."""
    if target in follower.following:
        follower.following.remove(target)
        action = "unfollowed"
    else:
        follower.following.append(target)
        action = "followed"
    
    db.commit()
    return action