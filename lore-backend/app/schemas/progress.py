from pydantic import BaseModel

class ProgressBase(BaseModel):
    user_id: int
    video_id: int
    completed: bool = False

class ProgressCreate(ProgressBase):
    pass

class Progress(ProgressBase):
    id: int

    class Config:
        orm_mode = True
