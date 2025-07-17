import os

# RAG API Settings
RAG_API_URL = "https://cb5c7cf4995c.ngrok-free.app"  # Update this with your current ngrok URL
RAG_API_TIMEOUT = 30

# Database
DATABASE_URL = "sqlite:///./test.db"

# JWT Settings
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CORS Settings
ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173", "*"]
