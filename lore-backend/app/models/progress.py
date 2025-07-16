from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime
from datetime import datetime
from ..database import Base

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    video_id = Column(Integer, ForeignKey("videos.id"))
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True, default=None)
