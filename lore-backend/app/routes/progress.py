from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas.progress import Progress, ProgressCreate
from ..models import progress as progress_model
from ..database import SessionLocal

router = APIRouter(prefix="/progress", tags=["progress"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=Progress)
def create_progress(progress: ProgressCreate, db: Session = Depends(get_db)):
    db_progress = progress_model.Progress(**progress.dict())
    db.add(db_progress)
    db.commit()
    db.refresh(db_progress)
    return db_progress

@router.get("/", response_model=list[Progress])
def read_progress(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(progress_model.Progress).offset(skip).limit(limit).all()

@router.get("/{progress_id}", response_model=Progress)
def read_progress_by_id(progress_id: int, db: Session = Depends(get_db)):
    db_progress = db.query(progress_model.Progress).filter(progress_model.Progress.id == progress_id).first()
    if not db_progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    return db_progress

@router.put("/{progress_id}", response_model=Progress)
def update_progress(progress_id: int, progress: ProgressCreate, db: Session = Depends(get_db)):
    db_progress = db.query(progress_model.Progress).filter(progress_model.Progress.id == progress_id).first()
    if not db_progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    for key, value in progress.dict().items():
        setattr(db_progress, key, value)
    db.commit()
    db.refresh(db_progress)
    return db_progress

@router.delete("/{progress_id}")
def delete_progress(progress_id: int, db: Session = Depends(get_db)):
    db_progress = db.query(progress_model.Progress).filter(progress_model.Progress.id == progress_id).first()
    if not db_progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    db.delete(db_progress)
    db.commit()
    return {"ok": True}
