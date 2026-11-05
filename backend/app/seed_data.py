from datetime import datetime
from sqlalchemy.orm import Session
from .models import Post, Game

INITIAL_POSTS = [
    {
        "slug": "exploring-small-language-models",
        "title": "Exploring Small Language Models",
        "excerpt": "Tại sao các mô hình ngôn ngữ nhỏ (SLMs) như Phi-3, Gemma-2B đang trở thành tương lai của AI chạy cục bộ trên thiết bị cá nhân.",
        "content": """# Exploring Small Language Models (SLMs)

Trong năm 2026, ranh giới giữa các mô hình ngôn ngữ lớn (LLMs hàng trăm tỷ tham số) và các mô hình nhỏ gọn (SLMs từ 1B - 8B tham số) đang dần thu hẹp. Team Tố Tề đã dành 3 tháng qua thử nghiệm triển khai các mô hình SLM như **Microsoft Phi-3**, **Google Gemma-2**, và **Llama-3 8B** trên phần cứng cận biên.

---

### 1. Tại sao SLM lại quan trọng?
* **Chi phí vận hành thấp:** Không cần cụm máy chủ H100 đắt đỏ, chỉ cần 1 GPU laptop hoặc NPU tích hợp là đã có thể suy luận với tốc độ 40+ tokens/giây.
* **Bảo mật và riêng tư:** Dữ liệu hoàn toàn nằm trong mạng nội bộ, phù hợp cho các giải pháp bảo mật cao hoặc hệ thống edge IoT.
* **Thời gian phản hồi tức thì (Zero-Latency):** Ứng dụng real-time như game NPC, autocomplete code được hưởng lợi tối đa.

---

### 2. Thử nghiệm thực tế với Ollama và vLLM
Team chúng tôi đã đóng gói thử nghiệm pipeline inference kết hợp:
```bash
ollama run gemma2:2b
```
Kết quả cho thấy với các tác vụ trích xuất thực thể (NER), tóm tắt tài liệu ngắn và phân loại văn bản, độ chính xác của Gemma-2B đạt tương đương 85% so với GPT-3.5 nhưng độ trễ giảm tới 70%.

---

### 3. Hướng phát triển tiếp theo
Chúng tôi đang tích hợp SLM trực tiếp vào NPC trong các tựa game WebGL sắp tới của team, cho phép nhân vật trong game có hội thoại tự nhiên mà không cần phụ thuộc vào cloud API!""",
        "category": "AI",
        "cover_image": "/images/post-ai.png",
        "author": "Minh & Team Tố Tề AI",
        "created_at": datetime(2026, 10, 20, 14, 30),
        "views": 428,
        "published": True
    },
    {
        "slug": "building-a-2d-game-with-godot",
        "title": "Building a 2D Game with Godot",
        "excerpt": "Hành trình từ bản phác thảo ý tưởng đến bản build WebGL hoàn chỉnh trên Godot 4.3 của nhóm phát triển Game Team Tố Tề.",
        "content": """# Building a 2D Game with Godot 4.3

Godot Engine đang chứng minh vị thế dẫn đầu trong mảng phát triển game độc lập (Indie Game). Bài viết này chia sẻ kiến trúc và quy trình Team Tố Tề đã sử dụng để đưa tựa game platformer 2D lên trình duyệt web.

---

### 1. Kiến trúc Scene và State Machine
Chúng tôi sử dụng State Pattern để quản lý trạng thái của nhân vật chính:
* `IdleState`
* `RunState`
* `JumpState`
* `DashState`

```gdscript
extends State
class_name PlayerJumpState

@export var jump_force: float = -420.0

func enter():
    player.velocity.y = jump_force
    player.play_animation("jump")

func physics_update(delta: float):
    if player.is_on_floor():
        transition_to("IdleState")
```

---

### 2. Tối ưu hóa xuất bản WebGL / HTML5
* Nén texture sang chuẩn VRAM ETC2 / ASTC.
* Kích hoạt SharedArrayBuffer và Threading thông qua thiết lập COOP/COEP headers trên Nginx/FastAPI.
* Kích thước bản build nén chỉ còn chưa đầy 18MB, tải cực nhanh trên thiết bị di động.

---

### 3. Bạn có thể chơi thử ngay!
Hãy ghé qua mục **Games** trên website để trải nghiệm trực tiếp bản demo mini do team phát triển!""",
        "category": "Game",
        "cover_image": "/images/post-game.png",
        "author": "Hoàng & Game Dev Team",
        "created_at": datetime(2026, 10, 12, 9, 15),
        "views": 612,
        "published": True
    },
    {
        "slug": "a-simple-rag-pipeline-with-qdrant",
        "title": "A Simple RAG Pipeline with Qdrant",
        "excerpt": "Cách xây dựng hệ thống Retrieval-Augmented Generation nhẹ, hiệu năng cao và dễ bảo trì sử dụng Qdrant Vector Database.",
        "content": """# A Simple RAG Pipeline with Qdrant

Retrieval-Augmented Generation (RAG) là chìa khóa để giúp các mô hình ngôn ngữ trả lời chính xác dựa trên kho tài liệu độc quyền của doanh nghiệp mà không bị ảo giác (hallucination).

---

### 1. Tại sao lại chọn Qdrant?
* Viết bằng ngôn ngữ **Rust**, tốc độ index và search hàng triệu vector trong mili-giây.
* Hỗ trợ lưu trữ in-memory lẫn on-disk với memmap tối ưu tài nguyên RAM.
* API Python trực quan, dễ tích hợp với FastAPI và LangChain/LlamaIndex.

---

### 2. Cài đặt và cấu trúc Pipeline
```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

client = QdrantClient(host="localhost", port=6333)

client.create_collection(
    collection_name="tote_kb",
    vectors_config=VectorParams(size=768, distance=Distance.COSINE),
)
```

---

### 3. Kết luận
Với pipeline này, hệ thống chatbot nội bộ của Team Tố Tề có thể tra cứu hơn 10,000 trang tài liệu kỹ thuật trong vòng 45ms, mang lại trải nghiệm tra cứu cực kỳ mượt mà cho các lập trình viên.""",
        "category": "Research",
        "cover_image": "/images/post-research.png",
        "author": "An & Research Team",
        "created_at": datetime(2026, 10, 5, 16, 45),
        "views": 389,
        "published": True
    }
]

INITIAL_GAMES = [
    {
        "slug": "tote-bot-runner",
        "title": "Tố Tề Bot: Space Runner",
        "description": "Giúp chú robot Tố Tề nhảy qua các chướng ngại vật và thu thập năng lượng trên hành tinh bí ẩn. Chơi trực tiếp trên web!",
        "details": "Điều khiển: Nhấn Phím Cách (Space) hoặc Chạm màn hình để Nhảy / Nhảy đúp (Double Jump). Thu thập sao để tăng điểm số!",
        "category": "Arcade",
        "cover_image": "/images/post-game.png",
        "play_url": "embedded-runner",
        "game_type": "embedded",
        "developer": "Tố Tề Game Studio",
        "created_at": datetime(2026, 10, 15, 11, 0),
        "plays_count": 1240
    },
    {
        "slug": "cyber-puzzle-2048",
        "title": "Cyber Tố Tề 2048",
        "description": "Ghép các khối số để đạt mốc 2048 điểm với phong cách giao diện tương lai và âm thanh sống động.",
        "details": "Điều khiển: Dùng các phím Mũi tên (Lên, Xuống, Trái, Phải) hoặc Vuốt để trượt các ô số.",
        "category": "Puzzle",
        "cover_image": "/images/post-research.png",
        "play_url": "embedded-2048",
        "game_type": "embedded",
        "developer": "Tố Tề Indie Team",
        "created_at": datetime(2026, 10, 8, 15, 20),
        "plays_count": 890
    },
    {
        "slug": "godot-dungeon-chronicles",
        "title": "Dungeon of Algorithms",
        "description": "Tựa game RPG 2D khám phá mê cung giải đố được xây dựng bằng Godot Engine 4. Bản demo WebGL.",
        "details": "Khám phá các căn phòng bí mật, né bẫy gai và tìm đường tới cánh cổng không gian tiếp theo.",
        "category": "Adventure",
        "cover_image": "/images/post-ai.png",
        "play_url": "embedded-dungeon",
        "game_type": "embedded",
        "developer": "Tố Tề Game Lab",
        "created_at": datetime(2026, 9, 28, 10, 0),
        "plays_count": 2150
    }
]

def seed_initial_data(db: Session):
    # Check if posts table is empty
    if db.query(Post).count() == 0:
        for p in INITIAL_POSTS:
            post = Post(**p)
            db.add(post)
        db.commit()
        print("Database seeded with initial posts!")

    # Check if games table is empty
    if db.query(Game).count() == 0:
        for g in INITIAL_GAMES:
            game = Game(**g)
            db.add(game)
        db.commit()
        print("Database seeded with initial games!")
