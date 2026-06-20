# 🐱 CatFarm HappyHome — Luna Farm

Web app จัดการฟาร์มแมว สร้างด้วย React 18 + FastAPI + MySQL

---

## โครงสร้างโปรเจค

```
lunafarm/
├── backend/        ← FastAPI (Python)
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── database.py
│   ├── routers/
│   │   ├── auth.py
│   │   └── cats.py
│   ├── requirements.txt
│   └── .env        ← ตั้งค่า DB และ secret
└── frontend/       ← React + Vite + Tailwind
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── api/
    │   └── context/
    ├── package.json
    └── vite.config.js
```

---

## 1. ตั้งค่า MySQL

เปิด MySQL แล้วสร้าง database:

```sql
CREATE DATABASE catfarm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

สร้าง admin user (ทำครั้งแรก):

```sql
-- รัน backend ก่อน เพื่อให้ tables ถูกสร้าง
-- แล้วค่อย insert admin ด้วย bcrypt hash

-- หรือใช้ Python script ด้านล่าง
```

---

## 2. ติดตั้งและรัน Backend

```bash
cd backend

# 1. สร้าง virtual environment
python -m venv venv
venv\Scripts\activate   # Windows

# 2. ติดตั้ง dependencies
pip install -r requirements.txt

# 3. ตั้งค่า .env
# แก้ไฟล์ .env — ใส่ DB_PASSWORD ของคุณ

# 4. รัน server
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### สร้าง Admin User (ครั้งแรก)

```python
# รัน Python script นี้ใน backend folder (หลัง venv activate):
from database import SessionLocal
from models import User, UserRole
from auth import get_password_hash

db = SessionLocal()
admin = User(
    username="admin",
    email="admin@lunafarm.com",
    hashed_password=get_password_hash("admin1234"),
    role=UserRole.admin
)
db.add(admin)
db.commit()
db.close()
print("✅ สร้าง admin เรียบร้อย")
```

บันทึกเป็น `create_admin.py` แล้วรัน:
```bash
python create_admin.py
```

---

## 3. ติดตั้งและรัน Frontend

```bash
cd frontend

# 1. ติดตั้ง dependencies
npm install

# 2. รัน dev server
npm run dev
```

เปิดเบราว์เซอร์: http://localhost:5173

---

## 4. ตั้งค่า ngrok (ให้เพื่อนเข้าได้)

```bash
# ติดตั้ง ngrok: https://ngrok.com/download

# Expose backend (port 8000)
ngrok http 8000

# Expose frontend (port 5173)  
ngrok http 5173
```

เมื่อ ngrok ให้ URL เช่น `https://abc123.ngrok-free.app`:
- แจก URL นี้ให้เพื่อน
- ใน `frontend/vite.config.js` อัปเดต proxy target เป็น ngrok URL ของ backend ถ้าต้องการ

### ใช้งานผ่าน ngrok (วิธีง่ายที่สุด)

1. รัน backend: `uvicorn main:app --reload --port 8000`
2. รัน frontend: `npm run dev`
3. รัน ngrok บน frontend: `ngrok http 5173`
4. แจก ngrok URL ให้เพื่อน

> **หมายเหตุ:** Frontend proxy (/api) จะส่งต่อไป localhost:8000 อัตโนมัติ
> หากเพื่อนใช้ผ่าน ngrok URL ตรงๆ ต้องรัน ngrok บน backend ด้วย แล้วอัปเดต `FRONTEND_URL` ใน .env

---

## 5. หน้าต่างๆ

| URL | รายละเอียด |
|-----|------------|
| `/` | หน้าแรก (Landing page) |
| `/cats` | รายการแมวทั้งหมด + ค้นหา/filter |
| `/cats/:id` | รายละเอียดแมวแต่ละตัว |
| `/login` | เข้าสู่ระบบ |
| `/register` | สมัครสมาชิก |
| `/admin` | Admin Dashboard (จัดการแมว CRUD) |

---

## 6. API Endpoints

| Method | Endpoint | รายละเอียด |
|--------|----------|------------|
| POST | `/api/auth/register` | สมัครสมาชิก |
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| GET | `/api/auth/me` | ข้อมูล user ปัจจุบัน |
| GET | `/api/cats` | รายการแมว (public) |
| GET | `/api/cats/:id` | รายละเอียดแมว |
| POST | `/api/cats` | เพิ่มแมว (admin) |
| PUT | `/api/cats/:id` | แก้ไขแมว (admin) |
| DELETE | `/api/cats/:id` | ลบแมว (admin) |
| WS | `/api/cats/ws` | WebSocket real-time |

---

## Stack

- **Frontend:** React 18, Vite, Tailwind CSS v3, React Router v6, Axios
- **Backend:** Python, FastAPI, SQLAlchemy, PyMySQL, JWT (python-jose), bcrypt, Uvicorn
- **Database:** MySQL
- **Real-time:** WebSocket (FastAPI built-in)
- **Tunnel:** ngrok
