from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Text
from ..database import Base

class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    task_type = Column(String, nullable=False)  # e.g., 'quiz', 'video', 'review'
    scheduled_date = Column(Date, nullable=False)
    completed = Column(Boolean, default=False) 