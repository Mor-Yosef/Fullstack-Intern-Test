@echo off
echo ========================================
echo   Chained Form Application - Quick Start
echo ========================================
echo.

echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)
echo ✅ Python found

echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js found

echo.
echo ========================================
echo   Setting up Backend (FastAPI)
echo ========================================
echo.

cd server

echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✅ Python dependencies installed

echo.
echo Starting Backend Server...
echo Backend will be available at: http://localhost:8001
echo API Documentation: http://localhost:8001/docs
echo.
start "Backend Server" cmd /k "python main.py"

echo.
echo ========================================
echo   Setting up Frontend (React)
echo ========================================
echo.

cd ..\client

echo Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo ✅ Node.js dependencies installed

echo.
echo Starting Frontend Server...
echo Frontend will be available at: http://localhost:3000
echo.
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo   🎉 Application Starting!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:8001
echo 📚 API Docs: http://localhost:8001/docs
echo.
echo ⏳ Please wait for both servers to fully start...
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:3000

echo.
echo ✅ Application is ready!
echo.
echo To stop the servers:
echo 1. Close the command windows for each server
echo 2. Or press Ctrl+C in each server window
echo.
pause
