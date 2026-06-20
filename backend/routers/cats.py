from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas
import auth as auth_module
import json

router = APIRouter(prefix="/api/cats", tags=["cats"])

# ---- WebSocket Manager ----
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        data = json.dumps(message, ensure_ascii=False, default=str)
        for connection in self.active_connections:
            try:
                await connection.send_text(data)
            except Exception:
                pass


manager = ConnectionManager()


# ---- Public endpoints ----
@router.get("", response_model=schemas.CatList)
def list_cats(
    status: Optional[str] = Query(None),
    breed: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(models.Cat)
    if status:
        query = query.filter(models.Cat.status == status)
    if breed:
        query = query.filter(models.Cat.breed.ilike(f"%{breed}%"))
    if search:
        query = query.filter(
            models.Cat.name.ilike(f"%{search}%") | models.Cat.breed.ilike(f"%{search}%")
        )
    total = query.count()
    cats = query.order_by(models.Cat.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "cats": cats}


@router.get("/{cat_id}", response_model=schemas.CatOut)
def get_cat(cat_id: int, db: Session = Depends(get_db)):
    cat = db.query(models.Cat).filter(models.Cat.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลแมว")
    return cat


# ---- Admin endpoints ----
@router.post("", response_model=schemas.CatOut)
async def create_cat(
    cat_data: schemas.CatCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_admin),
):
    cat = models.Cat(**cat_data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    await manager.broadcast({"event": "cat_added", "data": {"id": cat.id, "name": cat.name}})
    return cat


@router.put("/{cat_id}", response_model=schemas.CatOut)
async def update_cat(
    cat_id: int,
    cat_data: schemas.CatUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_admin),
):
    cat = db.query(models.Cat).filter(models.Cat.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลแมว")

    for field, value in cat_data.model_dump(exclude_unset=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    await manager.broadcast({"event": "cat_updated", "data": {"id": cat.id, "name": cat.name}})
    return cat


@router.delete("/{cat_id}")
async def delete_cat(
    cat_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth_module.require_admin),
):
    cat = db.query(models.Cat).filter(models.Cat.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="ไม่พบข้อมูลแมว")
    db.delete(cat)
    db.commit()
    await manager.broadcast({"event": "cat_deleted", "data": {"id": cat_id}})
    return {"message": f"ลบข้อมูลแมว {cat.name} เรียบร้อยแล้ว"}


# ---- WebSocket ----
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
