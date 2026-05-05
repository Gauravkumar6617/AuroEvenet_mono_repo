"""
One-time migration script: converts existing PostTag string rows
into normalized Tag + PostTag (join table) rows.

Run once:
    python -m app.repositories.migration_tags
"""
from sqlalchemy.orm import Session
from slugify import slugify
from app.db.session import SessionLocal
from app.models.postTagModel import PostTag
from app.models.tagModel import Tag


def migrate(db: Session):
    # Fetch all existing raw-string post_tag rows
    # NOTE: this assumes you haven't dropped the old `tag` string column yet.
    # After running this migration, remove the `tag` column via Alembic.
    rows = db.execute("SELECT id, post_id, tag FROM post_tags WHERE tag_id IS NULL").fetchall()
    print(f"Migrating {len(rows)} PostTag rows…")

    for row in rows:
        raw_name = row.tag.lower().strip()
        slug = slugify(raw_name)

        # Upsert Tag
        tag = db.query(Tag).filter(Tag.slug == slug).first()
        if not tag:
            tag = Tag(name=raw_name, slug=slug)
            db.add(tag)
            db.flush()

        # Update the existing PostTag row to reference the Tag id
        db.execute(
            "UPDATE post_tags SET tag_id = :tag_id WHERE id = :id",
            {"tag_id": tag.id, "id": row.id},
        )

    # Recalculate post_count for every tag
    tags = db.query(Tag).all()
    for tag in tags:
        tag.post_count = len(tag.post_tags)

    db.commit()
    print("Migration complete ✓")


if __name__ == "__main__":
    with SessionLocal() as db:
        migrate(db)
