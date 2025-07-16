from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ..schemas.quiz import Quiz, QuizCreate
from ..models import quiz as quiz_model
from ..database import SessionLocal
from typing import List, Any
from ..models.quiz_result import QuizResult
from ..utils.auth import get_current_user

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
    chapter: str = Body(None, embed=True),
    question_type: str = Body(None, embed=True),
    difficulty: str = Body(None, embed=True),
):
    # Forward these fields to the RAG model when integrated
    # For now, just return them in the response for testing
    # Replace this with actual RAG call when ready
    return {
        "questions": [
            {
                "question": f"Sample {question_type or 'mcq'} question {i+1} for {chapter or 'chapter'} ({difficulty or 'medium'})",
                "options": ["A", "B", "C", "D"] if (question_type or 'mcq') == 'mcq' else None,
                "answer": 0
            }
            for i in range(num_questions)
        ],
        "chapter": chapter,
        "question_type": question_type,
        "difficulty": difficulty,
        "num_questions": num_questions
    }

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

@router.post("/submit")
def submit_quiz(
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # data: {quiz_id: int, answers: List[int], questions: List[{answer: int, ...}]}
    quiz_id = data.get("quiz_id")
    answers = data.get("answers")
    questions = data.get("questions")
    if not quiz_id or answers is None or questions is None:
        raise HTTPException(status_code=400, detail="Missing quiz_id, answers, or questions")
    if len(answers) != len(questions):
        raise HTTPException(status_code=400, detail="Answers and questions length mismatch")
    # Calculate score
    correct = 0
    for i, q in enumerate(questions):
        if answers[i] == q.get("answer"):
            correct += 1
    score = (correct / len(questions)) * 100 if questions else 0.0
    # Store result
    quiz_result = QuizResult(user_id=current_user.id, quiz_id=quiz_id, score=score)
    db.add(quiz_result)
    db.commit()
    db.refresh(quiz_result)
    return {"score": score, "correct": correct, "total": len(questions)}
