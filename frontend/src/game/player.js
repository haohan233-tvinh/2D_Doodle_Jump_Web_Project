import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  MAX_VX,
  ACCE,
  MASATTRUOT,
} from './index.js';

export { PLAYER_WIDTH, PLAYER_HEIGHT };
export const HORIZONTAL_SPEED = 240;

export function createPlayer(overrides = {}) {
  return {
    x: 300,
    y: 388,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    ...overrides,
  };
}

/**
 * Cập nhật di chuyển ngang bằng hệ thống quán tính:
 * - Nhấn phím: gia tốc ACCE
 * - Bẻ lái đảo chiều: gia tốc ACCE + ma sát MASATTRUOT để bẻ lái đầm tay
 * - Nhả phím: ma sát MASATTRUOT hãm trớn mượt mà về 0
 */
export function updateHorizontal(player, direction, dt) {
  if (!player || typeof dt !== 'number') return player;

  const maxVx = MAX_VX || 420;
  const acce = ACCE || 1800;
  const friction = MASATTRUOT || 2000;

  // Di chuyển sang TRÁI
  if (direction < 0) {
    player.direction = 'left';
    if (player.vx > 0) {
      player.vx = Math.max(-maxVx, player.vx - (acce + friction) * dt);
    } else {
      player.vx = Math.max(-maxVx, player.vx - acce * dt);
    }
  }
  // Di chuyển sang PHẢI
  else if (direction > 0) {
    player.direction = 'right';
    if (player.vx < 0) {
      player.vx = Math.min(maxVx, player.vx + (acce + friction) * dt);
    } else {
      player.vx = Math.min(maxVx, player.vx + acce * dt);
    }
  }
  // NHẢ PHÍM: ma sát trượt hãm trớn mượt mà về 0
  else {
    if (player.vx > 0) {
      player.vx = Math.max(0, player.vx - friction * dt);
    } else if (player.vx < 0) {
      player.vx = Math.min(0, player.vx + friction * dt);
    }
  }

  // Cập nhật vị trí X từ vận tốc ngang vx
  player.x += player.vx * dt;
  return player;
}
