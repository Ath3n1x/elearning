from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from datetime import datetime
from ..database import Base

class QuizResult(Base):
    __tablename__ = "quiz_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Float)  # percentage score, e.g., 85.0
    completed_at = Column(DateTime, default=datetime.utcnow) 