from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProgressBase(BaseModel):
    user_id: int
    video_id: int
    completed: bool = False
    completed_at: Optional[datetime] = None

class ProgressCreate(ProgressBase):
    pass

class Progress(ProgressBase):
    id: int

    class Config:
        orm_mode = True
