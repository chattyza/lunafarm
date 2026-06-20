"""
รันไฟล์นี้ครั้งเดียวเพื่อสร้าง Admin user
ต้องรัน backend อย่างน้อยครั้งนึงก่อน เพื่อให้ tables ถูกสร้าง

วิธีรัน:
  cd backend
  venv\\Scripts\\activate
  python create_admin.py
"""

from database import SessionLocal, engine, Base
from models import User, UserRole
from auth import get_password_hash
import sys

# สร้าง tables ถ้ายังไม่มี
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    username = "admin"
    password = "admin1234"

    existing = db.query(User).filter(User.username == username).first()
    if existing:
        print(f"⚠️  User '{username}' มีอยู่แล้ว")
        sys.exit(0)

    admin = User(
        username=username,
        email="admin@lunafarm.com",
        hashed_password=get_password_hash(password),
        role=UserRole.admin,
    )
    db.add(admin)
    db.commit()
    print(f"✅ สร้าง Admin เรียบร้อย!")
    print(f"   Username: {username}")
    print(f"   Password: {password}")
    print(f"   เข้าได้ที่: http://localhost:5173/login")
finally:
    db.close()
