from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from ..schemas.quiz import Quiz, QuizCreate
from ..models import quiz as quiz_model
from ..database import SessionLocal
from typing import List, Any
from ..models.quiz_result import QuizResult
from ..utils.auth import get_current_user
from ..config import RAG_API_URL, RAG_API_TIMEOUT
import httpx
import asyncio

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/generate")
async def generate_quiz(
    num_questions: int = Body(..., embed=True),
    chapter: str = Body(None, embed=True),
    question_type: str = Body(None, embed=True),
    difficulty: str = Body(None, embed=True),
):
    """
    Generate quiz questions using the RAG API
    """
    try:
        # Prepare request data for RAG API
        rag_request_data = {
            "chapter": chapter or "Chapter 1",
            "num_questions": num_questions,
            "question_type": question_type or "mcq",
            "difficulty": difficulty or "medium"
        }
        
        # Call RAG API
        async with httpx.AsyncClient(timeout=RAG_API_TIMEOUT) as client:
            response = await client.post(
                f"{RAG_API_URL}/generate",
                json=rag_request_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                rag_response = response.json()
                
                # Transform RAG response to our quiz format
                questions = []
                for i, q in enumerate(rag_response.get("questions", [])):
                    question_data = {
                        "question": q.get("question", f"Question {i+1}"),
                        "options": q.get("options", ["A", "B", "C", "D"]),
                        "answer": q.get("answer", 0),
                        "explanation": q.get("explanation", "")
                    }
                    questions.append(question_data)
                
                return {
                    "questions": questions,
                    "chapter": chapter,
                    "question_type": question_type,
                    "difficulty": difficulty,
                    "num_questions": num_questions,
                    "source": "RAG API"
                }
            else:
                # Fallback to sample questions if RAG API fails
                return {
                    "questions": [
                        {
                            "question": f"Sample {question_type or 'mcq'} question {i+1} for {chapter or 'chapter'} ({difficulty or 'medium'})",
                            "options": ["A", "B", "C", "D"] if (question_type or 'mcq') == 'mcq' else None,
                            "answer": 0,
                            "explanation": "Sample explanation"
                        }
                    for i in range(num_questions)
                    ],
                    "chapter": chapter,
                    "question_type": question_type,
                    "difficulty": difficulty,
                    "num_questions": num_questions,
                    "source": "Fallback (RAG API unavailable)"
                }
                
    except Exception as e:
        # Return fallback questions if RAG API is completely unavailable
        return {
            "questions": [
                {
                    "question": f"Sample {question_type or 'mcq'} question {i+1} for {chapter or 'chapter'} ({difficulty or 'medium'})",
                    "options": ["A", "B", "C", "D"] if (question_type or 'mcq') == 'mcq' else None,
                    "answer": 0,
                    "explanation": "Sample explanation"
                }
            for i in range(num_questions)
            ],
            "chapter": chapter,
            "question_type": question_type,
            "difficulty": difficulty,
            "num_questions": num_questions,
            "source": "Fallback (Error: " + str(e) + ")"
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
