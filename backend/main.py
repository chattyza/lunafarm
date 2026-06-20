from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from database import engine, Base
import models
import os

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CatFarm HappyHome API",
    description="API สำหรับระบบจัดการฟาร์มแมว Luna Farm",
    version="1.0.0",
)

# CORS
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # เปลี่ยนเป็น origins หากต้องการความปลอดภัยมากขึ้น
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

# Routers
from routers import auth, cats, upload
from database import SessionLocal
from models import SiteVisit
from sqlalchemy import update
app.include_router(auth.router)
app.include_router(cats.router)
app.include_router(upload.router)


@app.get("/")
def root():
    return {"message": "🐱 CatFarm HappyHome API", "status": "running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/visits")
def increment_visit():
    db = SessionLocal()
    try:
        row = db.query(SiteVisit).filter(SiteVisit.id == 1).first()
        if not row:
            row = SiteVisit(id=1, count=1)
            db.add(row)
        else:
            row.count += 1
        db.commit()
        return {"count": row.count}
    finally:
        db.close()


@app.get("/api/visits")
def get_visits():
    db = SessionLocal()
    try:
        row = db.query(SiteVisit).filter(SiteVisit.id == 1).first()
        return {"count": row.count if row else 0}
    finally:
        db.close()
