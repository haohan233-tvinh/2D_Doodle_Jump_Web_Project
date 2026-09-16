import { useEffect, useRef, useState } from 'react';
import { createGame } from '../game/engine.js';

export default function GameCanvas({ config, showLoopDemo = false }) {
  const canvasRef = useRef(null);
  const [frameCount, setFrameCount] = useState(0);
  useEffect(() => {
    setFrameCount(0);
    const game = createGame(canvasRef.current, config, {
      onFrame: showLoopDemo ? ({ frameCount }) => {
        // Chỉ cập nhật chữ mỗi 10 khung cho dễ đọc; game vẫn vẽ từng khung.
        if (frameCount === 1 || frameCount % 10 === 0) setFrameCount(frameCount);
      } : undefined,
    });
    return () => game.destroy();
  }, [config, showLoopDemo]);
  return <>
    <canvas ref={canvasRef} width="640" height="520" aria-label="Khung game với nhân vật đứng im trên bệ">Trình duyệt cần hỗ trợ Canvas 2D.</canvas>
    {showLoopDemo && <p className="caption">
      Đã vẽ lại: <output aria-label="Số khung đã vẽ" aria-live="off">{frameCount}</output> lần.
      <br />Số tăng = vòng lặp đang chạy. Nhân vật vẫn đứng im.
    </p>}
  </>;
}
