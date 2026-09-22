// 1. CẤU HÌNH MÀN HÌNH & GAMEPLAY
export const SCREEN_WIDTH = 960;
export const SCREEN_HEIGHT = 540;
export const TARGET_HEIGHT = 3000; // độ cao đích
export const MAX_TIME = 180; // 180 giây
export const HUD_SNAPSHOT = 100; // ms
export const FIXED_DT = 1 / 60; // 60 FPS (0.0166s mỗi frame)
export const CAMERA_SIGHT_RATIO = 0.60; // Vị trí nhân vật trên màn hình (60% từ trên xuống, hạ thấp camera gần đáy)

// 2. HỆ VẬT LÝ NHÂN VẬT (PLAYER) - Cân bằng từ 2D Doodle Jump cho Canvas
export const GRAVITY = 1200; // px/s^2 - Trọng lực kéo xuống trong Canvas
export const JUMP_VELOCITY = -520; // px/s - Vận tốc nảy cơ bản (Âm để bay lên trong Canvas)
export const SPRING_JUMP_VELOCITY = -850; // px/s - Vận tốc khi dẫm lò xo

// Hệ gia tốc & ma sát ngang (Inertia & Kinematics)
export const ACCE = 1800; // px/s^2 - Gia tốc tăng tốc di chuyển ngang
export const MASATTRUOT = 2000; // px/s^2 - Ma sát trượt hãm phanh khi nhả phím
export const MAX_VX = 420; // px/s - Vận tốc ngang tối đa (Trái/Phải)
export const MAX_VY = 950; // px/s - Vận tốc rơi tự do tối đa

// 3. THÔNG SỐ NHÂN VẬT (PLAYER)
export const PLAYER_WIDTH = 34;
export const PLAYER_HEIGHT = 42;

// 4. CẤU HÌNH BỆ ĐỠ (PLATFORMS)
export const P_HEIGHT_MAX = 14; 
export const P_HEIGHT = 14; 
export const P_WIDTH_MIN = 80;
export const P_WIDTH_MAX = 200;
export const P_MOVING_SPEED = 80; // px/s - Tốc độ bệ di động ngang

// 5. THUẬT TOÁN SINH BỆ (PROCEDURAL GENERATION)
export const STEP_Y_MIN = 60; // Khoảng cách dọc tối thiểu giữa 2 bệ
export const STEP_Y_MAX = 130; // Khoảng cách dọc tối đa

// 6. HIỆU ỨNG THỜI GIAN
export const BREAKABLE_DELAY = 200; // ms trước khi bệ nâu vỡ
export const DISAPPEAR_DELAY = 800; // ms trước khi bệ trắng biến mất

// 7. THÔNG SỐ VÀ CẤU HÌNH 4 CÁ TÍNH BOT
export const BOT_WIDTH = 44;
export const BOT_HEIGHT = 44;
export const BOT_ACCEL = 1800;

export const BOT_COLORS = {
  NOVICE: '#3498db',      // Xanh dương
  STANDARD: '#9b59b6',    // Tím
  SPEEDRUNNER: '#e67e22', // Cam
  PERFECT: '#e74c3c',     // Đỏ
};

export const BOT_PROFILES = {
  NOVICE: {
    name: 'Thầy Sơn',
    speedMultiplier: 0.72,
    maxJumpReach: 170,
    reactionDelay: 0.08,
    aimOffset: 16,
    strategy: 'nearest_wide',
    skipJumpChance: 0.0,
    breakableMistakeChance: 0.010,
  },
  STANDARD: {
    name: 'Thầy Việt',
    speedMultiplier: 0.80,
    maxJumpReach: 175,
    reactionDelay: 0.06,
    aimOffset: 10,
    strategy: 'safe_balanced',
    skipJumpChance: 0.05,
    breakableMistakeChance: 0.009,
  },
  SPEEDRUNNER: {
    name: 'Thầy Hiệp',
    speedMultiplier: 0.90,
    maxJumpReach: 170,
    reactionDelay: 0.04,
    aimOffset: 5,
    strategy: 'highest_aggressive',
    skipJumpChance: 0.12,
    breakableMistakeChance: 0.008,
  },
  PERFECT: {
    name: 'Thầy Nam',
    speedMultiplier: 0.86,
    maxJumpReach: 180,
    reactionDelay: 0.03,
    aimOffset: 2,
    strategy: 'optimal_uncontested',
    skipJumpChance: 0.10,
    breakableMistakeChance: 0.006,
  },
};