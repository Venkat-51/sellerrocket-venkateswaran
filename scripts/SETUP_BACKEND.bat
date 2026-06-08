@echo off
REM Backend Setup Script for Windows

echo Installing backend dependencies...
cd backend
call npm install

echo.
echo ✓ Backend setup complete!
echo.
echo To start the development server, run:
echo   cd backend
echo   npm run dev
echo.
echo The API will be available at: http://localhost:3001
echo.
pause
