from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import date
from ..models import Reminder
from ..database import SessionLocal
from ..utils.auth import get_current_user

router = APIRouter(prefix="/reminders", tags=["reminders"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add")
def add_reminder(
    title: str = Body(...),
    task_type: str = Body(...),
    scheduled_date: date = Body(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    reminder = Reminder(
        user_id=current_user.id,
        title=title,
        task_type=task_type,
        scheduled_date=scheduled_date,
        completed=False
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder

@router.get("/")
def list_reminders(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    date_from: date = None,
    date_to: date = None
):
    query = db.query(Reminder).filter(Reminder.user_id == current_user.id)
    if date_from:
        query = query.filter(Reminder.scheduled_date >= date_from)
    if date_to:
        query = query.filter(Reminder.scheduled_date <= date_to)
    return query.order_by(Reminder.scheduled_date).all()

@router.put("/{reminder_id}/done")
def mark_reminder_done(reminder_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == current_user.id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    reminder.completed = True
    db.commit()
    db.refresh(reminder)
    return reminder

@router.delete("/{reminder_id}")
def delete_reminder(reminder_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    reminder = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == current_user.id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(reminder)
    db.commit()
    return {"ok": True} 