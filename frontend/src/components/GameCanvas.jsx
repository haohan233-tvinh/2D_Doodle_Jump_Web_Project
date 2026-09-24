import { useEffect, useRef, useState } from 'react';
import { createGame } from '../game/engine.js';

export default function GameCanvas({
  config,
  showLoopDemo = false,
  restartKey = 0,
  isPaused = false,
  onUpdateStats,
  onGameOver,
  children,
}) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const isPausedRef = useRef(isPaused);
  const statsRef = useRef(onUpdateStats);
  const gameOverRef = useRef(onGameOver);
  isPausedRef.current = isPaused;
  statsRef.current = onUpdateStats;
  gameOverRef.current = onGameOver;
  const [frameCount, setFrameCount] = useState(0);

  useEffect(() => {
    setFrameCount(0);
    const game = createGame(canvasRef.current, config, {
      isPaused: () => isPausedRef.current,
      onFrame: showLoopDemo ? ({ frameCount }) => {
        // Chỉ cập nhật chữ mỗi 10 khung cho dễ đọc; game vẫn vẽ từng khung.
        if (frameCount === 1 || frameCount % 10 === 0) setFrameCount(frameCount);
      } : undefined,
      onStats: (value) => statsRef.current?.(value),
      onGameOver: (value) => gameOverRef.current?.(value),
    });
    gameRef.current = game;
    return () => {
      game.destroy();
      gameRef.current = null;
    };
  }, [config, showLoopDemo, restartKey]);

  return <div className="game-stage">
    <canvas ref={canvasRef} width="960" height="540" aria-label="Khung game ngang 16:9, dùng A/D hoặc phím trái/phải để di chuyển">Trình duyệt cần hỗ trợ Canvas 2D.</canvas>
    <div className="touch-controls" aria-label="Điều khiển cảm ứng">
      <button type="button" disabled={isPaused} aria-label="Đi trái"
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); gameRef.current?.setDirection('left', true); }}
        onPointerUp={() => gameRef.current?.setDirection('left', false)}
        onPointerCancel={() => gameRef.current?.setDirection('left', false)}>←</button>
      <button type="button" disabled={isPaused} aria-label="Đi phải"
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); gameRef.current?.setDirection('right', true); }}
        onPointerUp={() => gameRef.current?.setDirection('right', false)}
        onPointerCancel={() => gameRef.current?.setDirection('right', false)}>→</button>
    </div>
    {showLoopDemo && <p className="caption">
      Đã vẽ lại: <output aria-label="Số khung đã vẽ" aria-live="off">{frameCount}</output> lần.
      <br />Số tăng = vòng lặp đang chạy. Dùng A/D hoặc ←/→ để thử di chuyển.
    </p>}
    {children}
  </div>;
}

