import { createInput } from './input.js';
import { createState, finish, snapshot, step } from './simulation.js';
import { render } from './render.js';
import { FIXED_DT, HUD_SNAPSHOT } from './index.js';

export function createGame(canvas, config, {
  onFrame, onState, onFinish, onStats, onGameOver, isPaused,
} = {}) {
  const context = canvas.getContext('2d');
  const state = createState(config);
  const input = createInput();
  let previousTime = null;
  let accumulator = 0;
  let lastSnapshot = -Infinity;
  let frameCount = 0;
  let stopped = false;
  let notifiedFinish = false;
  let frameId;

  function emit() {
    const value = snapshot(state);
    onState?.(value);
    onStats?.({ currentHeight: value.height, maxHeight: value.maxHeight,
      elapsedMs: value.elapsedMs, ranking: value.ranking, placement: value.placement });
    return value;
  }

  function frame(time) {
    if (stopped) return;
    const dt = previousTime === null ? 0
      : Math.min(Math.max((time - previousTime) / 1000, 0), 1 / 30);
    previousTime = time;
    if (!isPaused?.() && !state.finished) {
      accumulator += dt;
      while (accumulator + 1e-10 >= FIXED_DT) {
        step(state, FIXED_DT, Number(input.state.right) - Number(input.state.left));
        accumulator -= FIXED_DT;
      }
    } else accumulator = 0;

    render(context, state);
    frameCount += 1;
    onFrame?.({ frameCount, dt });
    if (time - lastSnapshot >= HUD_SNAPSHOT || state.finished) {
      lastSnapshot = time;
      emit();
    }
    if (state.finished && !notifiedFinish) {
      notifiedFinish = true;
      onFinish?.(state.result, state.reason);
      onGameOver?.({ finalHeight: state.result.height, finalMaxHeight: state.maxHeight,
        elapsedMs: state.result.elapsed_ms, placement: state.result.placement,
        outcome: state.result.outcome, reason: state.reason });
    }
    if (!stopped) frameId = requestAnimationFrame(frame);
  }

  emit();
  frameId = requestAnimationFrame(frame);
  return {
    quit() { if (!state.finished) { finish(state, 'quit'); emit(); } },
    setDirection(direction, active) { input.setTouch(direction, active); },
    getSnapshot() { return snapshot(state); },
    destroy() {
      if (stopped) return;
      stopped = true;
      input.destroy();
      cancelAnimationFrame(frameId);
      context.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
