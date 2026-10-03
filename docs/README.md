# Mục Lục Tài Liệu Kỹ Thuật (Documentation Index)

Trung tâm điều hướng tài liệu kỹ thuật của dự án **2D Doodle Jump Web Project** (USTH).

> **Nguyên tắc tài liệu:** Mã nguồn làm chủ **WHAT** và **HOW**; tài liệu làm chủ **WHY** (quyết định thiết kế, ràng buộc kiến trúc, giao thức, lý do loại bỏ phương án thay thế) và **WHERE** (điều hướng điểm chạm thực thi). Tài liệu không diễn giải lại logic code bằng văn xuôi.

---

## 1. Evergreen Authority Surfaces (Tài Liệu Chuẩn Mực Hệ Thống)

Các tài liệu phản ánh quy chuẩn kỹ thuật, quyết định thiết kế và giao thức hiện hành:

- [`START_HERE.md`](START_HERE.md): Khởi chạy và thiết lập môi trường dev (`npm run setup`, `npm run dev`) cùng kịch bản Docker Compose (`compose.yaml`).
- [`API.md`](API.md): Đặc tả hợp đồng REST (`/api/*`) và giao thức Socket.IO thời gian thực (Race V2), schemas dữ liệu, ràng buộc chống gian lận và mã lỗi chuẩn.
- [`ONLINE_RACE_BACKEND.md`](ONLINE_RACE_BACKEND.md): Kiến trúc đồng bộ cuộc đua online; cơ sở chọn `Flask-SocketIO` + `simple-websocket` (pure Python threading mode giải quyết triệt để lỗi PEP 669 trên Python 3.12 và loại bỏ phụ thuộc C++ Build Tools trên Windows); quy tắc trọng tài xác thực cán đích.
- [`QUY_UOC_CHUNG.md`](QUY_UOC_CHUNG.md): Hằng số vật lý logic, hệ tọa độ màn hình và cơ chế bot đồng hành (`catchUp`, bám camera, không tính điểm/không thi đua).
- [`PERFORMANCE.md`](PERFORMANCE.md): Pipeline tối ưu tài nguyên bot (`scripts/prepare-game-assets.mjs`), cơ chế tạm dừng RAF/audio khi tab bị ẩn (`document.hidden`), và phương pháp đo bộ nhớ thực tế.
- [`HUONG_DAN_ISSUES.md`](HUONG_DAN_ISSUES.md): Quy chuẩn quản lý luồng công việc, báo lỗi qua GitHub Issues (`[BUG]`, `[FEAT]`, `[TASK]`) và quy ước PR.

---

## 2. Executable Owners & System Boundaries (Điểm Chạm Thực Thi & Ranh Giới)

Điều hướng trực tiếp tới các điểm chạm mã nguồn và kịch bản thực thi:

- **Bản đồ định hướng & Ràng buộc cứng (GPS):** [`../FEATURE_MAP.md`](../FEATURE_MAP.md) — Bản đồ chi tiết điểm chạm theo module, logic decoupled core và test file tương ứng.
- **Core Game Engine (Browser Decoupled Core):**
  - Vòng đời ván đấu & Game loop: [`../frontend/src/game/engine.js`](../frontend/src/game/engine.js)
  - Mô phỏng vật lý & va chạm: [`../frontend/src/game/physics.js`](../frontend/src/game/physics.js)
  - Trí tuệ bot đồng hành: [`../frontend/src/game/bots.js`](../frontend/src/game/bots.js)
- **Giao diện React & Canvas:** [`../frontend/src/pages/GamePage.jsx`](../frontend/src/pages/GamePage.jsx), [`../frontend/src/components/GameCanvas.jsx`](../frontend/src/components/GameCanvas.jsx)
- **Backend API & Realtime Gateway:**
  - Điểm khởi chạy Flask: [`../backend/app.py`](../backend/app.py)
  - REST Endpoints: [`../backend/routes/`](../backend/routes/)
  - Socket.IO Events: [`../backend/events/`](../backend/events/)
- **Cơ sở dữ liệu SQLite:**
  - Định nghĩa lược đồ: [`../backend/schema.sql`](../backend/schema.sql)
  - Quản lý kết nối: [`../backend/db.py`](../backend/db.py)
- **Công cụ dòng lệnh & Triển khai:**
  - Thiết lập môi trường: [`../scripts/setup.mjs`](../scripts/setup.mjs)
  - Máy chủ tích hợp dev: [`../scripts/dev.mjs`](../scripts/dev.mjs)
  - Bộ chạy kiểm thử: [`../scripts/test.mjs`](../scripts/test.mjs)
  - Pipeline tài nguyên ảnh: [`../scripts/prepare-game-assets.mjs`](../scripts/prepare-game-assets.mjs)
  - Khởi chạy container: [`../compose.yaml`](../compose.yaml)

---

## 3. Stateful, Educational & Reference Records (Hồ Sơ Mốc Phát Triển & Tham Khảo)

Các tài liệu đóng băng theo mốc lịch sử, nghiên cứu hoặc hỗ trợ thuyết trình (không đại diện cho hợp đồng phát hành hiện hành):

- [`HOC_CODE_VA_THUYET_TRINH_3_GIO.md`](HOC_CODE_VA_THUYET_TRINH_3_GIO.md): Giáo trình học cấp tốc 180 phút và kịch bản thuyết trình bảo vệ đồ án cho sinh viên USTH (đối chiếu tại commit `21265f1`).
- [`FIRST_TASKS.md`](FIRST_TASKS.md): Phân rã nhiệm vụ ban đầu (Milestone 1) cho các thành viên trong nhóm.
- [`LEAD_01_DEMO.md`](LEAD_01_DEMO.md): Biên bản kiểm tra vòng lặp game ban đầu (`?demo=loop`).
- [`function-reference.md`](function-reference.md): Bảng thống kê danh mục hàm và phương thức toàn dự án (ảnh chụp snapshot ngày 2026-10-03).
- [`graphify-out/GRAPH_REPORT.md`](graphify-out/GRAPH_REPORT.md): Báo cáo trực quan hóa đồ thị phụ thuộc mã nguồn được sinh tự động bởi Graphify.
