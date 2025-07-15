from sqlalchemy import Column, Integer, String, ForeignKey
from ..database import Base

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(String)
    answer = Column(String)
    video_id = Column(Integer, ForeignKey("videos.id"))
