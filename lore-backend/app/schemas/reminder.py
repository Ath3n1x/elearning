from pydantic import BaseModel
from datetime import date
from typing import Optional

class ReminderBase(BaseModel):
    title: str
    task_type: str
    scheduled_date: date
    completed: Optional[bool] = False

class ReminderCreate(ReminderBase):
    pass

class Reminder(ReminderBase):
    id: int
    class Config:
        from_attributes = True 