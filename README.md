# 🚀 Team Tố Tề — Blog & Games Platform (MVP)

Dự án website chính thức cho **Team Tố Tề**, được thiết kế dựa trên bản thiết kế ý tưởng tại `assets/idea.png`. Nền tảng phục vụ 2 mục đích chính:
1. **Đăng bài viết công nghệ (Blog):** Chia sẻ các bài viết chuyên sâu về AI, Small Language Models, Game Dev, Research, Backend Engineering.
2. **Khu trò chơi do team phát triển (Games):** Trưng bày và hỗ trợ người dùng **chơi trực tiếp các tựa game Web/Canvas** do các thành viên sáng tạo.

---

## 📸 Giao diện thiết kế theo ý tưởng (`assets/idea.png`)
* **Logo Thương hiệu:** Biểu tượng 2 vạch bo góc cam (`//`) đặc trưng của Team Tố Tề.
* **Thanh điều hướng:** Home, Blog, Games, About Us kèm công cụ Tìm kiếm và Chế độ Sáng/Tối (Dark/Light Mode).
* **Hero Mascot:** Chú robot biểu tượng của team bên cạnh laptop cùng các huy hiệu tương tác (Code `</>`, Game `🎮`, Doc `📄`).
* **Latest Posts:** 3 bài viết nổi bật chuẩn theo mockup (`AI: Exploring Small Language Models`, `Game: Building a 2D Game with Godot`, `Research: A Simple RAG Pipeline with Qdrant`).
* **Web Arcade:** Trải nghiệm ngay tựa game mini 2D Runner (*Tố Tề Bot: Space Runner*) trực tiếp trên trình duyệt với âm thanh và cơ chế nhảy đúp!

---

## 🏗️ Cấu trúc thư mục

```
team-tote-landing/
├── assets/                  # Tài nguyên thiết kế gốc (idea.png, icon,...)
│   └── idea.png
├── backend/                 # Backend API (FastAPI + SQLite + SQLAlchemy)
│   ├── app/
│   │   ├── main.py          # FastAPI application & lifespan config
│   │   ├── database.py      # Cấu hình SQLite engine & session
│   │   ├── models.py        # Database models (Post, Game)
│   │   ├── schemas.py       # Pydantic schemas validation
│   │   ├── seed_data.py     # Tự động nạp dữ liệu mẫu ban đầu
│   │   └── routers/
│   │       ├── posts.py     # API quản lý và tìm kiếm bài viết
│   │       └── games.py     # API quản lý danh sách game & lượt chơi
│   ├── requirements.txt     # Danh sách thư viện Python
│   ├── Dockerfile           # Đóng gói backend container
│   ├── run.bat              # Script chạy backend cho Windows
│   └── run.sh               # Script chạy backend cho Linux/macOS
├── frontend/                # Frontend SPA (React 19 + Vite + Tailwind CSS)
│   ├── public/images/       # Logo, mascot robot & thumbnail bài viết
│   ├── src/
│   │   ├── components/      # Navbar, Hero, PostCard, GameCard, MiniGamePlayer...
│   │   ├── services/api.js  # Tầng kết nối REST API backend
│   │   ├── App.jsx          # Điều hướng trang & trạng thái toàn cục
│   │   └── index.css        # Tailwind styles & theme variables
│   ├── package.json         # Danh sách packages frontend
│   ├── Dockerfile           # Đóng gói frontend Nginx container
│   └── nginx.conf           # Cấu hình Reverse Proxy cho Nginx
├── docker-compose.yml       # Khởi chạy toàn bộ hệ thống bằng 1 lệnh Docker
├── run_dev.bat              # Khởi động nhanh cả Backend & Frontend trên Windows
├── run_dev.sh               # Khởi động nhanh trên Linux/macOS
└── README.md
```

---

## ⚡ Hướng dẫn cài đặt & Khởi chạy

Bạn có thể chạy dự án trên bất kỳ máy tính nào bằng một trong các phương thức sau:

### Cách 1: Khởi động tự động bằng Script (Khuyên dùng)

#### Trên Windows:
Nhấp đúp hoặc chạy file trong terminal:
```cmd
run_dev.bat
```
*(Script sẽ tự động tạo môi trường ảo Python `venv`, cài đặt thư viện cần thiết và mở 2 cửa sổ chạy song song Backend + Frontend)*.

#### Trên Linux / macOS:
```bash
chmod +x run_dev.sh
./run_dev.sh
```

---

### Cách 2: Khởi động bằng Môi trường ảo (Manual)

#### 1. Khởi chạy Backend (Python 3.10+):
```bash
cd backend

# Tạo và kích hoạt môi trường ảo
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Cài đặt thư viện
pip install -r requirements.txt

# Chạy server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* **Backend API:** `http://127.0.0.1:8000`
* **Swagger API Docs trực quan:** `http://127.0.0.1:8000/docs`

#### 2. Khởi chạy Frontend:
Mở một terminal mới:
```bash
cd frontend
npm install
npm run dev
```
* **Frontend Web:** `http://localhost:5173`

---

### Cách 3: Đóng gói và chạy bằng Docker (Chạy trên mọi máy tính không cần cài Python/Node)

Chỉ cần cài sẵn [Docker Desktop](https://www.docker.com/), mở thư mục gốc và chạy:
```bash
docker compose up --build
```
Hệ thống sẽ tự động build và chạy:
* **Frontend (Nginx):** `http://localhost:3000`
* **Backend API:** `http://localhost:8000`

---

## 🌟 Các tính năng nổi bật của bản MVP

1. **Giao diện hiện đại & Thân thiện:** Màu sắc pastel ấm áp (cam đào / trắng kem), gradient chuyển màu mềm mại, hỗ trợ đầy đủ Dark Mode / Light Mode.
2. **Khu vực Trò chơi tương tác (Interactive Arcade):** Tích hợp trò chơi canvas mini *Tố Tề Bot Runner* với âm thanh tổng hợp Web Audio API, nhảy đúp, tính điểm kỷ lục và ghi nhận lượt chơi về backend.
3. **Bộ lọc & Tìm kiếm tức thì:** Tìm kiếm theo từ khóa bài viết, tên game, hoặc lọc theo danh mục (`AI`, `Game`, `Research`).
4. **Form Đăng bài & Thêm Game:** Hỗ trợ thành viên trong team tạo bài viết mới bằng Markdown hoặc bổ sung game vào danh sách ngay trên giao diện web.
5. **Cơ sở dữ liệu tự động Seed Data:** Khởi động lần đầu tiên sẽ tự nạp sẵn 3 bài viết mẫu và 3 tựa game demo từ mockup thiết kế.
