# PowerShell runner for Team Tố Tề Landing
$ErrorActionPreference = "Stop"
$rootDir = $PSScriptRoot
Set-Location $rootDir

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       Khởi động Team Tố Tề Landing, Blog & Games       " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Kiem tra Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[LỖI] Không tìm thấy Python trên hệ thống!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Python 3 và thêm vào PATH." -ForegroundColor Yellow
    exit 1
}

# 2. Kiem tra npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[LỖI] Không tìm thấy npm / Node.js!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Node.js từ https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# 3. Kiem tra Backend venv
$venvPython = Join-Path $rootDir "backend\venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Host "[1/3] Đang tạo môi trường ảo Python (backend\venv)..." -ForegroundColor Yellow
    python -m venv (Join-Path $rootDir "backend\venv")
    Write-Host "[2/3] Đang cài đặt dependencies cho Backend..." -ForegroundColor Yellow
    & $venvPython -m pip install --upgrade pip
    & $venvPython -m pip install -r (Join-Path $rootDir "backend\requirements.txt")
}

# 4. Kiem tra Frontend node_modules
$frontendModules = Join-Path $rootDir "frontend\node_modules"
if (-not (Test-Path $frontendModules)) {
    Write-Host "[3/3] Đang cài đặt dependencies cho Frontend..." -ForegroundColor Yellow
    Push-Location (Join-Path $rootDir "frontend")
    npm install
    Pop-Location
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Đang khởi chạy Backend và Frontend trong 2 cửa sổ..." -ForegroundColor Green
Write-Host " - Backend:  http://127.0.0.1:8000  (API Docs: /docs)" -ForegroundColor Yellow
Write-Host " - Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Khoi chay Backend
Start-Process cmd.exe -ArgumentList "/k", "cd /d `"$rootDir\backend`" && call venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

# Khoi chay Frontend
Start-Process cmd.exe -ArgumentList "/k", "cd /d `"$rootDir\frontend`" && npm run dev"

Write-Host "Đã khởi chạy cả Backend và Frontend thành công!" -ForegroundColor Green
