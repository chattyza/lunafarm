from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class CatStatus(str, Enum):
    available = "available"
    adopted = "adopted"
    reserved = "reserved"


class UserRole(str, Enum):
    admin = "admin"
    user = "user"


# ---- Auth ----
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ---- Cat ----
class CatBase(BaseModel):
    name: str
    breed: str
    age_months: int
    gender: str
    color: Optional[str] = None
    weight_kg: Optional[float] = None
    status: CatStatus = CatStatus.available
    personality: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[float] = 0
    vaccinated: bool = False
    neutered: bool = False


class CatCreate(CatBase):
    pass


class CatUpdate(BaseModel):
    name: Optional[str] = None
    breed: Optional[str] = None
    age_months: Optional[int] = None
    gender: Optional[str] = None
    color: Optional[str] = None
    weight_kg: Optional[float] = None
    status: Optional[CatStatus] = None
    personality: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[float] = None
    vaccinated: Optional[bool] = None
    neutered: Optional[bool] = None


class CatOut(CatBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CatList(BaseModel):
    total: int
    cats: List[CatOut]


# ---- WebSocket ----
class WSMessage(BaseModel):
    event: str
    data: dict
