from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..schemas.user import User
from ..models import user as user_model
from ..database import SessionLocal
from ..utils.auth import get_current_user

api_profile_router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@api_profile_router.get("/api/user/me", response_model=User, response_model_by_alias=True)
def api_user_me(current_user = Depends(get_current_user)):
    return User.from_orm(current_user)

@api_profile_router.post("/api/profile", response_model=User, response_model_by_alias=True)
async def api_profile_create(request: Request, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    data = await request.json()
    name = data.get("name")
    age = data.get("age")
    grade = data.get("grade")
    user = db.query(user_model.User).filter(user_model.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if name and name != user.username:
        # Check if username is already taken by another user
        existing = db.query(user_model.User).filter(user_model.User.username == name).first()
        if existing and existing.id != user.id:
            raise HTTPException(status_code=400, detail="Username already taken")
        user.username = name
    if hasattr(user, 'age') and age is not None:
        user.age = age
    if hasattr(user, 'grade') and grade is not None:
        user.grade = grade
    db.commit()
    db.refresh(user)
    return User.from_orm(user) 