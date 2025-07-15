from pydantic import BaseModel

class QuizBase(BaseModel):
    question: str
    answer: str
    video_id: int

class QuizCreate(QuizBase):
    pass

class Quiz(QuizBase):
    id: int

    class Config:
        orm_mode = True
