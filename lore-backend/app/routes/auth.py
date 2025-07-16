from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..schemas.user import User, UserCreate
from ..models import user as user_model
from ..database import SessionLocal
from ..utils.auth import verify_password, get_password_hash, create_access_token
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm

class UserLogin(BaseModel):
    email: str
    password: str

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_username = db.query(user_model.User).filter(user_model.User.username == user.username).first()
    if db_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    hashed_password = get_password_hash(user.password)
    new_user = user_model.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_active=True,
        age=user.age,
        grade=user.grade
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Use email as username
    db_user = db.query(user_model.User).filter(user_model.User.email == form_data.username).first()
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}
