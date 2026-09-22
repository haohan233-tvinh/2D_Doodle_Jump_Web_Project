import { createInput } from './input.js';
import { createPlayer, updateHorizontal } from './player.js';
import { applyPhysics, handlePlatformCollisions, handleScreenWrap } from './physics.js';
import { createWorld, updatePlatforms } from './world.js';
import { render } from './render.js';
import { CAMERA_SIGHT_RATIO } from './index.js';

// LEAD-01: điều phối việc cập nhật và vẽ; không xử lý di chuyển ở đây.
export function createGame(canvas, config, { onFrame, onStats, onGameOver, isPaused } = {}) {
  const context = canvas.getContext('2d');
  const state = { player: createPlayer(), world: createWorld(), config };
  const input = createInput();
  let previousTime = null;
  let frameCount = 0;
  let stopped = false;
  let frameId;
  let maxHeight = 0;
  let isGameOver = false;

  function frame(time) {
    if (stopped) return;

    if (isPaused?.() || isGameOver) {
      previousTime = time;
      if (!stopped) frameId = requestAnimationFrame(frame);
      return;
    }

    // A. Tính số giây từ khung trước; máy khựng cũng chỉ đi một bước nhỏ.
    const dt = previousTime === null ? 0 : Math.min(Math.max((time - previousTime) / 1000, 0), 1 / 30);
    previousTime = time;

    // FE-01 cập nhật vị trí ngang; engine chỉ điều phối.
    const direction = Number(input.state.right) - Number(input.state.left);
    updateHorizontal(state.player, direction, dt);

    handleScreenWrap(state.player, canvas.width);
    updatePlatforms(state.world, dt);
    applyPhysics(state.player, dt);
    handlePlatformCollisions(state.player, state.world.platforms);

    // Tính toán độ cao leo được (mặt bệ ban đầu y = 388)
    const currentHeight = Math.max(0, Math.round(388 - state.player.y));
    if (currentHeight > maxHeight) {
      maxHeight = currentHeight;
    }
    onStats?.({ currentHeight, maxHeight, player: state.player });

    // Camera chỉ cuộn lên; giữ nhân vật ở gần đáy màn hình (~60% chiều cao từ trên xuống).
    const sightRatio = config?.cameraRatio ?? CAMERA_SIGHT_RATIO ?? 0.60;
    const cameraTargetY = state.player.y - canvas.height * sightRatio;
    state.world.cameraY = Math.min(state.world.cameraY, cameraTargetY);

    // Kiểm tra nhân vật rơi khỏi đáy khung nhìn màn hình
    if (state.player.y - state.world.cameraY > canvas.height + state.player.height) {
      if (typeof onGameOver === 'function') {
        isGameOver = true;
        onGameOver({ finalHeight: maxHeight, finalMaxHeight: maxHeight });
      } else {
        // Bản demo tự tạo lượt mới khi nhân vật rơi khỏi khung nhìn.
        state.player = createPlayer();
        state.world = createWorld();
        maxHeight = 0;
      }
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
