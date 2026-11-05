@echo off
chcp 65001 >nul
echo ========================================================
echo        Khởi động Team Tố Tề Landing, Blog & Games
echo ========================================================
echo.

:: Check Backend venv
if not exist "backend\venv" (
    echo [1/3] Đang tạo môi trường ảo Python (backend\venv)...
    python -m venv backend\venv
    call backend\venv\Scripts\activate.bat
    echo [2/3] Cài đặt dependencies cho Backend...
    pip install -r backend\requirements.txt
)

:: Check Frontend node_modules
if not exist "frontend\node_modules" (
    echo [3/3] Cài đặt dependencies cho Frontend...
    cd frontend && npm install && cd ..
)

echo.
echo Khởi chạy Backend và Frontend...
start "Team Tố Tề Backend (FastAPI)" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
start "Team Tố Tề Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo  Backend:  http://127.0.0.1:8000  (API Docs: /docs)
echo  Frontend: http://localhost:5173
echo ========================================================
echo.
pause
