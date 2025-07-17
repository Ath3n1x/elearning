from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, videos, quiz, progress, profile
from .routes.api_profile import api_profile_router
from .routes.chat import router as chat_router
from .routes.reminder import router as reminder_router
from .database import Base, engine
from .config import ALLOWED_ORIGINS

app = FastAPI(
    title="E-Learning Platform API",
    description="A comprehensive e-learning platform with RAG-powered quiz generation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(videos.router)
app.include_router(quiz.router)
app.include_router(progress.router)
app.include_router(profile.router)
app.include_router(api_profile_router)  # No prefix for /api/user/me and /api/profile
app.include_router(chat_router)
app.include_router(reminder_router)

@app.get("/")
def read_root():
    return {
        "status": "ok", 
        "message": "E-Learning Platform API is running",
        "version": "1.0.0",
        "rag_api": "https://cb5c7cf4995c.ngrok-free.app"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "rag_api_connected": True}
