# Doodle Jump USTH

Game leo cao 2D (Doodle Jump) hiện đại với kiến trúc Decoupled Core, chế độ chơi đơn đồng hành cùng 4 giảng viên USTH và chế độ đua trực tuyến thời gian thực (Online Race V2).

Hệ thống được phát triển trên nền tảng **React 19**, **HTML5 Canvas 2D**, **Python 3.12 (Flask 3.1.3 + Flask-SocketIO 5.4.1)** và cơ sở dữ liệu **SQLite**.

---

## 🎮 Chế Độ Trò Chơi (Game Modes)

1. **Solo Mode (Chơi đơn đồng hành):**
   - 4 giảng viên USTH đồng hành cùng người chơi dưới dạng AI bot (`catchUp`, bám theo camera, chờ người chơi).
   - Bot không thi đua hay tranh giành điểm số với người chơi; bảng xếp hạng và lịch sử điểm chỉ ghi nhận thành tích của người thật.
2. **Online Race V2 (Đua trực tuyến thời gian thực):**
   - Đua leo cao đối kháng thời gian thực (2–4 người chơi) với hệ thống phòng chờ (lobby), đếm ngược đồng bộ và đồng bộ bóng đối thủ (Ghost Sync 10–15 Hz).
   - Hộp kỹ năng tương tác trên đường đua: tăng tốc phản lực (`boost`), bắn đạn gây choáng (`stun`), dịch chuyển tức thời (`teleport`).
   - Máy chủ đóng vai trò trọng tài tối cao (Server-authoritative): kiểm soát chống gian lận (Anti-cheat), kiểm tra thời gian tối thiểu ($T_{min} \ge 7500$ms) và các trạm kiểm soát (checkpoints) trước khi công nhận kết quả cán mốc độ cao 3000m.
3. **Đa ngôn ngữ (i18n Localization):**
   - Hỗ trợ thời gian thực 3 ngôn ngữ: **Tiếng Việt**, **Tiếng Anh (English)** và **Tiếng Pháp (Français)**; chuyển đổi trực tiếp trên thanh điều hướng hoặc menu mà không cần tải lại trang.

---

## 🏛️ Kiến Trúc Hệ Thống (Architecture Decisions)

- **Nguyên tắc Decoupled Core:**
  - Logic mô phỏng game ([`frontend/src/game/`](frontend/src/game/)) là Pure JavaScript Core Engine độc lập hoàn toàn với framework UI. Tuyệt đối không phụ thuộc React hay React hooks trong engine.
  - Giao diện người dùng ([`frontend/src/pages/`](frontend/src/pages/), [`frontend/src/components/`](frontend/src/components/)) là lớp React thuần túy, chịu trách nhiệm kết xuất HUD, menu, điều phối phòng chờ và kết nối socket.
- **Xử lý thời gian thực đa nền tảng (Realtime Concurrency):**
  - Backend sử dụng `Flask-SocketIO` kết hợp `simple-websocket` ở chế độ **threading mode**.
  - Quyết định loại bỏ `gevent` và `eventlet` nhằm khắc phục triệt để lỗi PEP 669 trên Python 3.12 và loại bỏ yêu cầu cài đặt C++ Build Tools phức tạp trên môi trường Windows.
- **Ranh giới dữ liệu & Đồng bộ:**
  - Lưu trữ SQLite giao dịch ([`backend/schema.sql`](backend/schema.sql), [`backend/db.py`](backend/db.py)) ghi nhận lịch sử lượt chơi (`/api/runs`) và bảng xếp hạng (`/api/leaderboard`) phân tách theo phiên bản luật (`v1` và `v2`).

---

## 🚀 Khởi Chạy Nhanh (Quickstart)

### Yêu cầu môi trường
- **Node.js:** `>= 24 LTS`
- **Python:** `3.12`
- **Git**

### 1. Khởi chạy trực tiếp (Local Development)

```bash
# Cài đặt môi trường ảo Python, pip packages và npm packages
npm run setup

# Khởi chạy đồng thời Flask Backend (:3000) và Vite Frontend (:5173)
npm run dev
```

Truy cập giao diện: **http://localhost:5173** (API Flask hoạt động tại `http://127.0.0.1:3000`). Nhấn `Ctrl + C` để dừng cả hai tiến trình.

### 2. Khởi chạy bằng Docker Compose

Hệ thống cung cấp sẵn kịch bản Docker Compose với volume lưu trữ cơ sở dữ liệu bền vững (`game-data`):

```bash
# Khởi chạy stack trong nền
docker compose up --build -d

# Kiểm tra tự động tính sẵn sàng của web, API, socket và dữ liệu
python scripts/check-docker.py

# Xem logs dịch vụ
docker compose logs -f

# Dừng stack (giữ nguyên dữ liệu SQLite)
docker compose down

# Dừng stack và xóa toàn bộ dữ liệu SQLite
docker compose down -v
```

Truy cập ứng dụng đóng gói: **http://localhost:8080**.

---

## 🧪 Kiểm Thử & Đóng Gói (Testing & Build)

Dự án áp dụng quy chuẩn kiểm thử tự động bắt buộc (Autonomous Verification) trước mọi cam kết mã nguồn:

```bash
# Chạy toàn bộ tests (Pytest Backend + Vitest Frontend)
npm test

# Kiểm tra tính toàn vẹn tài nguyên và đóng gói frontend
npm run build
```

- **Backend tests:** [`backend/tests/`](backend/tests/) (kiểm tra REST API, hợp đồng dữ liệu, SQLite idempotency và Socket.IO events).
- **Frontend tests:** [`frontend/src/tests/`](frontend/src/tests/) (kiểm tra vật lý, va chạm, bot AI, input, i18n và game engine).

---

## 🗺️ Điều Hướng & Tài Liệu Kỹ Thuật (Documentation & Ownership)

Tài liệu dự án tuân thủ nguyên tắc: *Mã nguồn làm chủ WHAT/HOW; Tài liệu làm chủ WHY/WHERE*.

| Tài liệu / Ranh giới | Mục đích & Điểm chạm |
| :--- | :--- |
| 📍 [`FEATURE_MAP.md`](FEATURE_MAP.md) | **Bản đồ GPS dự án:** Tra cứu 11 module tính năng, điểm chạm UI/Logic/Test và các ràng buộc cứng (Hard Negative Constraints). |
| 📚 [`docs/README.md`](docs/README.md) | **Mục lục tài liệu kỹ thuật:** Tổng hợp toàn bộ tài liệu đặc tả, kiến trúc và hồ sơ phát triển. |
| 🏁 [`docs/START_HERE.md`](docs/START_HERE.md) | Hướng dẫn onboarding chi tiết từng bước cho thành viên mới và thao tác Docker. |
| 🔌 [`docs/API.md`](docs/API.md) | Đặc tả hợp đồng REST (`/api/*`) và các sự kiện Socket.IO thời gian thực (Race V2). |
| ⚡ [`docs/ONLINE_RACE_BACKEND.md`](docs/ONLINE_RACE_BACKEND.md) | Thiết kế kiến trúc đồng bộ mạng, cơ chế phòng đua và thuật toán chống gian lận backend. |
| 📐 [`docs/QUY_UOC_CHUNG.md`](docs/QUY_UOC_CHUNG.md) | Quy ước hằng số vật lý, hệ tọa độ màn hình và hành vi AI bot đồng hành. |
| ⏱️ [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md) | Pipeline chuẩn hóa tài nguyên sprite, tối ưu hóa bộ nhớ và vòng lặp render Canvas. |
| 📋 [`docs/HUONG_DAN_ISSUES.md`](docs/HUONG_DAN_ISSUES.md) | Quy chuẩn quản lý luồng công việc nhánh `dev`, định dạng GitHub Issues và Pull Requests. |

---

## 📁 Cấu Trúc Thư Mục (Directory Layout)

- [`frontend/src/game/`](frontend/src/game/): Core engine mô phỏng vật lý, máy trạng thái, AI bot và vòng lặp vẽ Canvas (Decoupled Core).
- [`frontend/src/pages/`](frontend/src/pages/) & [`frontend/src/components/`](frontend/src/components/): Giao diện người dùng React 19 (HUD, Lobby, Menu, Modal).
- [`frontend/src/locales/`](frontend/src/locales/): Từ điển bản địa hóa ngôn ngữ (`vi.json`, `en.json`, `fr.json`).
- [`backend/routes/`](backend/routes/): Các endpoints REST API (`/api/config`, `/api/runs`, `/api/leaderboard`, `/api/rooms`).
- [`backend/events/`](backend/events/): Bộ điều phối sự kiện Socket.IO cho Race V2 (`race`, `skills`, `finish`).
- [`backend/schema.sql`](backend/schema.sql) & [`backend/db.py`](backend/db.py): Lược đồ cơ sở dữ liệu SQLite và bộ điều phối kết nối.
- [`scripts/`](scripts/): Bộ công cụ tự động hóa cross-platform: cài đặt (`setup.mjs`), chạy dev (`dev.mjs`), test (`test.mjs`), kiểm tra Docker (`check-docker.py`).
