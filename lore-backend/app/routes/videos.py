from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas.video import Video, VideoCreate
from ..models import video as video_model
from ..database import SessionLocal

router = APIRouter(prefix="/videos", tags=["videos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=Video)
def create_video(video: VideoCreate, db: Session = Depends(get_db)):
    db_video = video_model.Video(**video.dict())
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

@router.get("/", response_model=list[Video])
def read_videos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(video_model.Video).offset(skip).limit(limit).all()

@router.get("/{video_id}", response_model=Video)
def read_video(video_id: int, db: Session = Depends(get_db)):
    db_video = db.query(video_model.Video).filter(video_model.Video.id == video_id).first()
    if not db_video:
        raise HTTPException(status_code=404, detail="Video not found")
    return db_video

@router.put("/{video_id}", response_model=Video)
def update_video(video_id: int, video: VideoCreate, db: Session = Depends(get_db)):
    db_video = db.query(video_model.Video).filter(video_model.Video.id == video_id).first()
    if not db_video:
        raise HTTPException(status_code=404, detail="Video not found")
    for key, value in video.dict().items():
        setattr(db_video, key, value)
    db.commit()
    db.refresh(db_video)
    return db_video

@router.delete("/{video_id}")
def delete_video(video_id: int, db: Session = Depends(get_db)):
    db_video = db.query(video_model.Video).filter(video_model.Video.id == video_id).first()
    if not db_video:
        raise HTTPException(status_code=404, detail="Video not found")
    db.delete(db_video)
    db.commit()
    return {"ok": True}
