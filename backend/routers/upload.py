from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.concurrency import run_in_threadpool
import cloudinary
import cloudinary.uploader
from auth import require_admin
import models
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 5 * 1024 * 1024  # 5 MB

router = APIRouter(prefix="/api/upload", tags=["upload"])


@router.post("")
async def upload_image(
    file: UploadFile = File(...),
    current_user: models.User = Depends(require_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="รองรับเฉพาะไฟล์ JPG, PNG, WebP, GIF")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="ไฟล์ใหญ่เกิน 5 MB")

    try:
        result = await run_in_threadpool(
            lambda: cloudinary.uploader.upload(
                contents,
                folder="lunafarm/cats",
                resource_type="image",
            )
        )
        return {"url": result["secure_url"]}
    except Exception as e:
        logger.error(f"Cloudinary upload error: {e}")
        raise HTTPException(status_code=500, detail=f"อัปโหลดไม่สำเร็จ: {str(e)}")
