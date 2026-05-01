from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker 
from app.core.config import settings

engine=create_engine(str(settings.DATABASE_URL), pool_pre_ping=True)
SessionLocal=sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base=declarative_base()

def get_db():
    print("DEBUG: Creating new database session...")
    db=SessionLocal()
    try:

        yield db
    except Exception as e:
        print(f"DEBUG: Database session error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()


# postgresql://postgres:7Ov71Xg2BRaNq7Wi@db.xybfeerxyrzhdnerqfqv.supabase.co:5432/postgres