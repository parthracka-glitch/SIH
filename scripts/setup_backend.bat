@echo off
echo ======================================================================
echo           AROGYA MITRA — Backend Setup & Database Seeder
echo ======================================================================
cd ..\backend
echo [INFO] Installing Python dependencies from requirements.txt...
pip install -r requirements.txt
echo.
echo [INFO] Seeding initial hospital branches, demo users, and clinical records...
python seed_data.py
echo.
echo [SUCCESS] Backend setup and seed completed!
pause
