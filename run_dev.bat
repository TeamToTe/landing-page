@echo off
cd /d "%~dp0"
chcp 65001 >nul

echo ========================================================
echo        Khoi dong Team To Te Landing, Blog ^& Games
echo ========================================================
echo.

REM Kiem tra Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay Python tren he thong!
    echo Vui long cai dat Python 3 va tick chon "Add python.exe to PATH".
    pause
    exit /b 1
)

REM Kiem tra npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay Node.js / npm!
    echo Vui long cai dat Node.js tu https://nodejs.org
    pause
    exit /b 1
)

REM Kiem tra Backend venv
if not exist "backend\venv\Scripts\python.exe" (
    echo [1/3] Dang khoi tao moi truong ao Python tai backend\venv ...
    python -m venv backend\venv
    if not exist "backend\venv\Scripts\python.exe" (
        echo [LOI] Khoi tao venv that bai.
        pause
        exit /b 1
    )
    echo [2/3] Dang cai dat dependencies Backend tu requirements.txt ...
    "backend\venv\Scripts\python.exe" -m pip install --upgrade pip
    "backend\venv\Scripts\pip.exe" install -r backend\requirements.txt
)

REM Kiem tra Frontend node_modules
if not exist "frontend\node_modules" (
    echo [3/3] Dang cai dat dependencies Frontend qua npm install ...
    cd /d "%~dp0frontend"
    call npm install
    cd /d "%~dp0"
)

echo.
echo ========================================================
echo  Dang mo 2 cua so Backend va Frontend...
echo  - Backend:  http://127.0.0.1:8000  (API Docs: /docs)
echo  - Frontend: http://localhost:5173
echo ========================================================
echo.

REM Khoi chay Backend FastAPI
start "Team To Te - Backend API" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

REM Khoi chay Frontend Vite
start "Team To Te - Frontend Vite" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Da khoi chay thanh cong ca 2 tien trinh.
echo Ban co the dong cua so nay hoac nhan phim bat ky de thoat.
pause >nul
