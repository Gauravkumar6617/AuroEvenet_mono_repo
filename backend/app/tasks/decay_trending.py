"""
Run nightly:  0 3 * * * python -m app.tasks.decay_trending
"""
from datetime import datetime, timedelta
from app.db.session import SessionLocal
from app.models.postModel import Post

def decay_all_scores(half_life_hours:int=24)->None:
    db = SessionLocal()
    try:
        post=db.query(Post).filter(Post.trending_score > 0.01).all()
        now=datetime.now(timezone.utc)

        for post in post:
            created=post.created_at
            if created.tzinfo is None:
                created = created.replace(tzinfo=timezone.utc)
            age_hours = (now - created).total_seconds() / 3600
            post.trending_score = post.trending_score * (0.5 ** (age_hours / half_life_hours))

            db.commit()
            print(f"[decay_trending] Decayed {len(post)} posts at {now.isoformat()}")
    finally:
        db.close()

if __name__ == "__main__":
    decay_all_scores()

            
        
   