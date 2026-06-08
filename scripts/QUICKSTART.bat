@echo off
REM Quick Start Script for Frontend and Backend

echo ========================================
echo Landing Page Design - Quick Start Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo Python and Node.js found!
echo.

echo ========================================
echo Step 1: Backend Setup
echo ========================================
cd Backend
echo Installing Python dependencies...
pip install -r requirements.txt

echo Running migrations...
python manage.py migrate

echo.
echo Backend setup complete!
echo.

echo ========================================
echo Step 2: Frontend Setup
echo ========================================
cd ..
echo Installing Node dependencies...
npm install

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start development:
echo.
echo Terminal 1 - Backend:
echo   cd Backend
echo   python manage.py runserver
echo.
echo Terminal 2 - Frontend:
echo   npm run dev
echo.
echo Frontend will be available at: http://localhost:5173
echo Backend will be available at: http://localhost:8000
echo Django Admin: http://localhost:8000/admin
echo.
pause
