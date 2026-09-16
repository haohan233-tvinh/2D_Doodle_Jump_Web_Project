import { createPlayer } from './player.js';
import { createWorld } from './world.js';
import { render } from './render.js';

// LEAD-01: điều phối việc cập nhật và vẽ; không xử lý di chuyển ở đây.
export function createGame(canvas, config, { onFrame } = {}) {
  const context = canvas.getContext('2d');
  const state = { player: createPlayer(), world: createWorld(), config };
  let previousTime = null;
  let frameCount = 0;
  let stopped = false;
  let frameId;

  function frame(time) {
    if (stopped) return;

    // A. Tính số giây từ khung trước; máy khựng cũng chỉ đi một bước nhỏ.
    const dt = previousTime === null ? 0 : Math.min(Math.max((time - previousTime) / 1000, 0), 1 / 30);
    previousTime = time;

    // B. Sau này gọi hàm trái/phải, vật lý... của các bạn tại đây.
    // Hiện chưa ghép hàm nào, nên vị trí nhân vật giữ nguyên.

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
      cancelAnimationFrame(frameId);
      context.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
