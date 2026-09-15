import { createPlayer } from './player.js';
import { createWorld } from './world.js';
import { render } from './render.js';

// LEAD-01: trưởng nhóm thêm một vòng lặp requestAnimationFrame, dt và cleanup.
// Bản V0.0 chỉ vẽ tĩnh. Thống nhất interface trước khi nối input/physics.
export function createGame(canvas, config) {
  const context = canvas.getContext('2d');
  const state = { player: createPlayer(), world: createWorld(), config };
  render(context, state);
  return {
    destroy() { context.clearRect(0, 0, canvas.width, canvas.height); },
  };
}
