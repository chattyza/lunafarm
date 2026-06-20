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
app.include_router(auth.router)
app.include_router(cats.router)
app.include_router(upload.router)


@app.get("/")
def root():
    return {"message": "🐱 CatFarm HappyHome API", "status": "running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
