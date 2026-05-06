from datetime import datetime, timezone
from app.db.session import SessionLocal
from app.models.postModel import Post

def decay_all_scores(half_life_hours: int = 24) -> None:
    db = SessionLocal()
    try:
        posts = db.query(Post).filter(Post.trending_score > 0.01).all()
        now = datetime.now(timezone.utc)

        for p in posts:
            created = p.created_at
            if created.tzinfo is None:
                created = created.replace(tzinfo=timezone.utc)

            age_hours = (now - created).total_seconds() / 3600
            decay_factor = 0.5 ** (age_hours / half_life_hours)

            p.trending_score *= decay_factor

        db.commit()  

        print(f"[decay_trending] Decayed {len(posts)} posts at {now.isoformat()}")

    finally:
        db.close()


if __name__ == "__main__":
    decay_all_scores()