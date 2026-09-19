import GameCanvas from '../components/GameCanvas.jsx';
import { useBackend } from '../hooks/useBackend.js';

export default function GamePage() {
  const backend = useBackend();
  const showLoopDemo = new URLSearchParams(window.location.search).get('demo') === 'loop';
  return <>
    <h1 className="game-title">Doodle Jump</h1>
    {backend.loading && <p role="status">Đang tải…</p>}
    {backend.error && <div role="alert">
      <p>Chưa tải được game.</p>
      <button onClick={backend.retry}>Thử lại</button>
    </div>}
    {backend.config && <>
      <GameCanvas config={backend.config} showLoopDemo={showLoopDemo} />
    </>}
  </>;
}
