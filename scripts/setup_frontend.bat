@echo off
echo ======================================================================
echo           AROGYA MITRA — Frontend Node Dependencies Setup
echo ======================================================================
cd ..\frontend
echo [INFO] Installing npm packages...
npm install
echo.
echo [INFO] Verifying TypeScript build...
npm run build
echo.
echo [SUCCESS] Frontend setup and build verified!
pause
