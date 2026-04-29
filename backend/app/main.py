from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from .db.session import Base, engine
import sentry_sdk

app = FastAPI()

# Base.metadata.create_all(engine)    



sentry_sdk.init(
    dsn="https://bdf1e1f696f204b5e7bd1dd373879cff@o4510718207524864.ingest.us.sentry.io/4511304291516416",
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
)



#### Routers
from app.routers.systemRouter import router as system_router
from app.api.v1.enpoint.auth import router as auth_router
from app.api.v1.enpoint.postEnpoint import router as post_router
from app.api.v1.enpoint.categoryEnpoint import router as category_router

app.include_router(auth_router, prefix="/api/v1")
app.include_router(post_router, prefix="/api/v1")
app.include_router(category_router, prefix="/api/v1")
app.include_router(system_router)

origins = [
    "http://localhost:5173",
    "https://blog-byte-mono-repo.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

