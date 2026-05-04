from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from .db.session import Base, engine
import sentry_sdk
from app.core.config import settings
app = FastAPI()

# Base.metadata.create_all(engine)    



sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
)



#### Routers
from app.routers.systemRouter import router as system_router
from app.api.v1.enpoint.auth import router as auth_router
from app.api.v1.enpoint.postEnpoint import router as post_router
from app.api.v1.enpoint.commentEndpoint import router as comment_router
from app.api.v1.enpoint.likeEndpoint import router as like_router




##superadmin routers
from app.api.v1.enpoint.admin.categories import router as admin_category_router
from app.api.v1.enpoint.admin.topics import router as admin_topic_router
from app.api.v1.enpoint.admin.questions import router as admin_question_router

## Social / Onboarding system routers
from app.api.v1.enpoint.userEndpoint import router as user_onboarding_router
from app.api.v1.enpoint.socialPostEndpoint import router as social_post_router

app.include_router(auth_router, prefix="/api/v1")
app.include_router(post_router, prefix="/api/v1")
app.include_router(comment_router, prefix="/api/v1")
app.include_router(like_router, prefix="/api/v1")
app.include_router(admin_category_router, prefix="/api/v1")
app.include_router(admin_topic_router, prefix="/api/v1")
app.include_router(admin_question_router, prefix="/api/v1")
app.include_router(user_onboarding_router, prefix="/api/v1")
app.include_router(social_post_router, prefix="/api/v1")
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

