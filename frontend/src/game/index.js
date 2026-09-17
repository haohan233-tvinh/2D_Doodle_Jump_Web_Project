// 1. CẤU HÌNH MÀN HÌNH & GAMEPLAY
export const SCREEN_WIDTH = 1000;
export const SCREEN_HEIGHT = 540;
export const TARGET_HEIGHT = 3000; // độ cao đích
export const MAX_TIME = 180; // 180 giây
export const HUD_SNAPSHOT = 100; // ms
export const FIXED_DT = 1 / 60; // 60 FPS (0.0166s mỗi frame)

// 2. HỆ VẬT LÝ NHÂN VẬT (PLAYER)
export const GRAVITY = 1200; // px/s^2 - Lực hút trái đất
export const JUMP_VELOCITY = 620; // px/s - Vận tốc nảy cơ bản (Cao ~160px)
export const SPRING_JUMP_VELOCITY = 900; // px/s - Vận tốc khi dẫm lò xo (Cao ~330px)

export const ACCE = 1200; // px/s^2 - Gia tốc ngang
export const MASATTRUOT = 1200; // px/s^2 - Ma sát ngang
export const MAX_VX = 380; // px/s - Vận tốc ngang tối đa (Trái/Phải)
export const MAX_VY = 1000; // px/s - Vận tốc rơi tự do tối đa (Tránh lỗi xuyên bệ)

// 3. CẤU HÌNH BỆ ĐỠ (PLATFORMS)
export const P_HEIGHT_MAX = 14; 
export const P_HEIGHT = 14; 
export const P_WIDTH_MIN = 80;  // Bổ sung: Chiều rộng tối thiểu
export const P_WIDTH_MAX = 200; // Giảm một chút so với 240 để tăng độ khó
export const P_MOVING_SPEED = 80; // px/s - Tốc độ bệ di động ngang

// 4. THUẬT TOÁN SINH BỆ (PROCEDURAL GENERATION)
export const STEP_Y_MIN = 60; // Khoảng cách dọc tối thiểu giữa 2 bệ
export const STEP_Y_MAX = 130; // Khoảng cách dọc tối đa (Phải < 160px)

// 5. HIỆU ỨNG THỜI GIAN
export const BREAKABLE_DELAY = 200; // ms trước khi bệ nâu vỡ
export const DISAPPEAR_DELAY = 800; // ms trước khi bệ trắng biến mất