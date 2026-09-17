export function createPlayer() {
  return { x: 300, y: 388, width: 34, height: 42, vx: 0, vy: 0 };
}

export const HORIZONTAL_SPEED = 240;

export function updateHorizontal(player, direction, dt) {
  if (!player || typeof dt !== 'number') return player;
  let dir = 0;
  if (direction === -1 || direction === 1) {
    dir = direction;
  } else if (direction < 0) {
    dir = -1;
  } else if (direction > 0) {
    dir = 1;
  }
  player.x += dir * HORIZONTAL_SPEED * dt;
  return player;
}
