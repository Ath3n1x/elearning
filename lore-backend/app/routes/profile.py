import fastapi
import sqlalchemy.orm
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..schemas.user import User
from ..models import user as user_model
from ..database import SessionLocal
from ..utils.auth import get_current_user

router = APIRouter(prefix="/profile", tags=["profile"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me", response_model=User)
def read_profile(current_user = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=User)
def update_profile(user_update: User, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(user_model.User).filter(user_model.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.username = user_update.username
    user.email = user_update.email
    db.commit()
    db.refresh(user)
    return user

# --- Added for frontend compatibility ---

@router.get("/api/user/me", response_model=User)
def api_user_me(current_user = Depends(get_current_user)):
    return current_user

@router.post("/api/profile", response_model=User)
async def api_profile_create(request: Request, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    data = await request.json()
    name = data.get("name")
    age = data.get("age")
    grade = data.get("grade")
    user = db.query(user_model.User).filter(user_model.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if name:
        user.username = name
    # Only set age/grade if they exist on the model
    if hasattr(user, 'age') and age is not None:
        user.age = age
    if hasattr(user, 'grade') and grade is not None:
        user.grade = grade
    db.commit()
    db.refresh(user)
    return user
