@echo off
echo.
echo  =============================================
echo    CatFarm HappyHome - Luna Farm
echo  =============================================
echo.

:: Backend
echo [1/3] Starting Backend (FastAPI)...
start "Backend" cmd /k "cd /d D:\lunafarm\backend && call venv\Scripts\activate && uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

:: Frontend
echo [2/3] Starting Frontend (Vite)...
start "Frontend" cmd /k "cd /d D:\lunafarm\frontend && npm run dev"

timeout /t 3 /nobreak >nul

:: ngrok
echo [3/3] Starting ngrok...
start "ngrok" cmd /k "ngrok http 5173"

echo.
echo  =============================================
echo   URLs:
echo   Local    : http://localhost:5173
echo   Backend  : http://localhost:8000/docs
echo   ngrok    : ดูใน window ngrok
echo  =============================================
echo.
pause
