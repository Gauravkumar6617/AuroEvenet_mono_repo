"""
Database initialization script
Creates all tables defined in the models
"""
from app.db.session import engine, Base
from app.models.userModel import User

def create_tables():
    """Create all database tables"""
    # Import all models here to ensure they are registered with Base
    from app.models.userModel import User
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()
