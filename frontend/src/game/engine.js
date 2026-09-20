import { createInput } from './input.js';
import { createPlayer, updateHorizontal } from './player.js';
import { applyPhysics, handlePlatformCollisions, handleScreenWrap } from './physics.js';
import { createWorld, updatePlatforms } from './world.js';
import { render } from './render.js';

// LEAD-01: điều phối việc cập nhật và vẽ; không xử lý di chuyển ở đây.
export function createGame(canvas, config, { onFrame } = {}) {
  const context = canvas.getContext('2d');
  const state = { player: createPlayer(), world: createWorld(), config };
  const input = createInput();
  let previousTime = null;
  let frameCount = 0;
  let stopped = false;
  let frameId;

  function frame(time) {
    if (stopped) return;

    // A. Tính số giây từ khung trước; máy khựng cũng chỉ đi một bước nhỏ.
    const dt = previousTime === null ? 0 : Math.min(Math.max((time - previousTime) / 1000, 0), 1 / 30);
    previousTime = time;

    // FE-01 cập nhật vị trí ngang; engine chỉ điều phối.
    updateHorizontal(state.player, Number(input.state.right) - Number(input.state.left), dt);

    handleScreenWrap(state.player, canvas.width);
    updatePlatforms(state.world, dt);
    applyPhysics(state.player, dt);
    handlePlatformCollisions(state.player, state.world.platforms);
    state.world.cameraY = Math.min(state.world.cameraY, state.player.y - canvas.height * 0.4);
    if (state.player.y - state.world.cameraY > canvas.height + state.player.height) {
      state.player = createPlayer();
      state.world = createWorld();
    }

    // C. Vẽ lại rồi hẹn trình duyệt chạy khung tiếp theo.
    render(context, state);
    frameCount += 1;
    onFrame?.({ frameCount, dt }); // Báo số thật cho bộ đếm demo.
    if (!stopped) frameId = requestAnimationFrame(frame);
  }

  frameId = requestAnimationFrame(frame);
  return {
    destroy() {
      if (stopped) return;
      stopped = true;
      input.destroy();
      cancelAnimationFrame(frameId);
      context.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
