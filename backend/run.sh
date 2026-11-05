#!/usr/bin/env bash
cd "$(dirname "$0")"
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

echo "Starting Backend API on http://127.0.0.1:8000 ..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
