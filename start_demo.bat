@echo off
echo 🎓 Starting E-Learning Platform Demo...
echo.

echo 📋 Starting Backend...
cd lore-backend
call venv\Scripts\Activate.bat
start "Backend Server" cmd /k "uvicorn app.main:app --host localhost --port 8000 --reload"

echo.
echo 📋 Starting Frontend...
cd ..\lore-frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 🚀 Demo is starting up...
echo.
echo 📍 Access Points:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo ⏳ Please wait for both servers to start...
echo.
pause 