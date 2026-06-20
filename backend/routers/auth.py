from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth as auth_module

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=schemas.UserOut)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check existing
    if db.query(models.User).filter(models.User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username นี้ถูกใช้แล้ว")
    if db.query(models.User).filter(models.User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email นี้ถูกใช้แล้ว")

    hashed = auth_module.get_password_hash(user_data.password)
    user = models.User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == user_data.username).first()
    if not user or not auth_module.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Username หรือ Password ไม่ถูกต้อง")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="บัญชีถูกปิดใช้งาน")

    token = auth_module.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth_module.get_current_user)):
    return current_user
