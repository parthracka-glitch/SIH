@echo off
echo ======================================================================
echo           AROGYA MITRA — Full Stack Health Platform Launcher
echo ======================================================================
echo.

echo [1/2] Starting Arogya Mitra Backend API (FastAPI on http://localhost:8000)...
start "Arogya Mitra Backend" cmd /k "cd backend && python seed_data.py && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Arogya Mitra Frontend (Vite on http://localhost:5173)...
start "Arogya Mitra Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================================================
echo   Both services are launching in separate consoles!
echo   Frontend : http://localhost:5173
echo   API Docs : http://localhost:8000/docs
echo ======================================================================
pause
