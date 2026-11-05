#!/usr/bin/env bash
set -e

echo "========================================================"
echo "       Khởi động Team Tố Tề Landing, Blog & Games       "
echo "========================================================"

# Check Python venv
if [ ! -d "backend/venv" ]; then
    echo "[1/3] Đang tạo môi trường ảo Python (backend/venv)..."
    python3 -m venv backend/venv
    source backend/venv/bin/activate
    echo "[2/3] Cài đặt dependencies cho Backend..."
    pip install -r backend/requirements.txt
fi

# Check Frontend node_modules
if [ ! -d "frontend/node_modules" ]; then
    echo "[3/3] Cài đặt dependencies cho Frontend..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "Khởi động Backend và Frontend song song..."
(cd backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) &
BACKEND_PID=$!

(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
