import fastapi
import sqlalchemy.orm
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..schemas.user import User
from ..models import user as user_model
from ..database import SessionLocal
from ..utils.auth import get_current_user
from sqlalchemy import func
from datetime import datetime, timedelta
from ..models import progress as progress_model
from ..models.quiz_result import QuizResult

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

@router.get("/api/user/stats")
def get_user_stats(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get all unique days with completed progress
    progress_days = db.query(func.date(progress_model.Progress.completed_at)).filter(
        progress_model.Progress.user_id == current_user.id,
        progress_model.Progress.completed == True,
        progress_model.Progress.completed_at != None
    ).distinct().all()
    days = sorted([d[0] for d in progress_days if d[0] is not None])
    # Calculate streak
    streak = 0
    today = datetime.utcnow().date()
    for i in range(len(days)-1, -1, -1):
        if days[i] == today - timedelta(days=streak):
            streak += 1
        else:
            break
    # Quiz Master: any quiz result with score >= 80
    quiz_master = db.query(QuizResult).filter(
        QuizResult.user_id == current_user.id,
        QuizResult.score >= 80
    ).first() is not None
    # Consistent Learner: more than 1 completed video
    video_count = db.query(progress_model.Progress).filter(
        progress_model.Progress.user_id == current_user.id,
        progress_model.Progress.completed == True
    ).count()
    badges = [
        {"name": "Quiz Master", "earned": quiz_master},
        {"name": "Consistent Learner", "earned": video_count > 1},
        {"name": f"{streak}-day Streak", "earned": streak > 0}
    ]
    return {"streak": streak, "badges": badges}
