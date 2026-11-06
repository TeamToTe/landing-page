#!/usr/bin/env bash
set -e

# Chuyển đến thư mục chứa script
cd "$(dirname "$0")"

echo "========================================================"
echo "       Khởi động Team Tố Tề Landing, Blog & Games       "
echo "========================================================"

# Kiểm tra lệnh python
if command -v python3 >/dev/null 2>&1; then
    PY_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PY_CMD="python"
else
    echo "[LỖI] Không tìm thấy Python trên hệ thống!"
    exit 1
fi

# Hàm lấy đường dẫn activate script cho venv (tương thích cả Windows Git Bash và Linux/macOS)
get_venv_activate() {
    local venv_path="$1"
    if [ -f "$venv_path/Scripts/activate" ]; then
        echo "$venv_path/Scripts/activate"
    elif [ -f "$venv_path/bin/activate" ]; then
        echo "$venv_path/bin/activate"
    fi
}

ACTIVATE_PATH=$(get_venv_activate "backend/venv")

# 1. Kiểm tra Python venv
if [ -z "$ACTIVATE_PATH" ]; then
    echo "[1/3] Đang tạo môi trường ảo Python (backend/venv)..."
    $PY_CMD -m venv backend/venv
    ACTIVATE_PATH=$(get_venv_activate "backend/venv")
    if [ -z "$ACTIVATE_PATH" ]; then
        echo "[LỖI] Không thể khởi tạo môi trường ảo Python!"
        exit 1
    fi
    source "$ACTIVATE_PATH"
    echo "[2/3] Cài đặt dependencies cho Backend..."
    pip install -r backend/requirements.txt
fi

# 2. Kiểm tra Frontend node_modules
if [ ! -d "frontend/node_modules" ]; then
    echo "[3/3] Cài đặt dependencies cho Frontend..."
    (cd frontend && npm install)
fi

echo ""
echo "========================================================"
echo " Khởi động song song Backend và Frontend..."
echo " - Backend:  http://127.0.0.1:8000 (Docs: /docs)"
echo " - Frontend: http://localhost:5173"
echo "========================================================"
echo ""

# Chạy Backend
(cd backend && source "../$ACTIVATE_PATH" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload) &
BACKEND_PID=$!

# Chạy Frontend
(cd frontend && npm run dev) &
FRONTEND_PID=$!

# Dọn dẹp tiến trình khi dừng (Ctrl+C)
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT INT TERM

wait
