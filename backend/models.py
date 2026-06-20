from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Enum, Float, BigInteger
from sqlalchemy.sql import func
from database import Base
import enum


class CatStatus(str, enum.Enum):
    available = "available"
    adopted = "adopted"
    reserved = "reserved"


class UserRole(str, enum.Enum):
    admin = "admin"
    user = "user"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Cat(Base):
    __tablename__ = "cats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    breed = Column(String(100), nullable=False)
    age_months = Column(Integer, nullable=False)
    gender = Column(Enum("male", "female", name="gender_enum"), nullable=False)
    color = Column(String(100))
    weight_kg = Column(Float)
    status = Column(Enum(CatStatus), default=CatStatus.available)
    personality = Column(String(255))  # comma-separated tags e.g. "ขี้อ้อน,ซน,กินเก่ง"
    description = Column(Text)
    image_url = Column(String(500))
    price = Column(Float, default=0)
    vaccinated = Column(Boolean, default=False)
    neutered = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SiteVisit(Base):
    __tablename__ = "site_visits"

    id = Column(Integer, primary_key=True, default=1)
    count = Column(BigInteger, default=0)
