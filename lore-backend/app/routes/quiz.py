from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ..schemas.quiz import Quiz, QuizCreate
from ..models import quiz as quiz_model
from ..database import SessionLocal
from typing import List, Any

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/generate")
def generate_quiz(
    num_questions: int = Body(..., embed=True),
    params: dict = Body({}, embed=True),
):
    if num_questions < 1 or num_questions > 50:
        raise HTTPException(status_code=400, detail="Number of questions must be between 1 and 50.")
    # Placeholder: RAG logic will generate unique questions here
    questions = [
        {"question": f"Question {i+1}", "options": ["A", "B", "C", "D"], "answer": 0}
        for i in range(num_questions)
    ]
    return {"questions": questions}

@router.post("/", response_model=Quiz)
def create_quiz(quiz: QuizCreate, db: Session = Depends(get_db)):
    db_quiz = quiz_model.Quiz(**quiz.dict())
    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

@router.get("/", response_model=list[Quiz])
def read_quizzes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(quiz_model.Quiz).offset(skip).limit(limit).all()

@router.get("/{quiz_id}", response_model=Quiz)
def read_quiz(quiz_id: int, db: Session = Depends(get_db)):
    db_quiz = db.query(quiz_model.Quiz).filter(quiz_model.Quiz.id == quiz_id).first()
    if not db_quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return db_quiz

@router.put("/{quiz_id}", response_model=Quiz)
def update_quiz(quiz_id: int, quiz: QuizCreate, db: Session = Depends(get_db)):
    db_quiz = db.query(quiz_model.Quiz).filter(quiz_model.Quiz.id == quiz_id).first()
    if not db_quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    for key, value in quiz.dict().items():
        setattr(db_quiz, key, value)
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

@router.delete("/{quiz_id}")
def delete_quiz(quiz_id: int, db: Session = Depends(get_db)):
    db_quiz = db.query(quiz_model.Quiz).filter(quiz_model.Quiz.id == quiz_id).first()
    if not db_quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    db.delete(db_quiz)
    db.commit()
    return {"ok": True}
