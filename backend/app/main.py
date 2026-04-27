from fastapi import FastAPI
from app.db.session import Base, engine


app = FastAPI()

Base.metadata.create_all(engine)    


#### Routers
from app.routers.systemRouter import router as system_router
from app.api.v1.enpoint.auth import router as auth_router
from app.api.v1.enpoint.postEnpoint import router as post_router
app.include_router(auth_router, prefix="/api/v1")
app.include_router(post_router, prefix="/api/v1")
app.include_router(system_router)



