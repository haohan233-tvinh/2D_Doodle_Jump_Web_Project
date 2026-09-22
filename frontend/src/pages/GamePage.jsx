import { useState, useEffect, useCallback } from 'react';
import GameCanvas from '../components/GameCanvas.jsx';
import { TopBar, FloatingHUD, StartMenu, GameOverModal, LeaderboardModal } from '../components/HUD.jsx';
import { useBackend } from '../hooks/useBackend.js';

export default function GamePage() {
  const backend = useBackend();
  const showLoopDemo = new URLSearchParams(window.location.search).get('demo') === 'loop';

  const [phase, setPhase] = useState(showLoopDemo ? 'running' : 'ready');
  const [stats, setStats] = useState({ height: 0, maxHeight: 0 });
  const [elapsedMs, setElapsedMs] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const [playerProfile, setPlayerProfile] = useState({ nickname: '', skinId: 'doodle' });
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (phase !== 'running') return;
    const start = performance.now() - elapsedMs;
    const timer = setInterval(() => {
      setElapsedMs(performance.now() - start);
    }, 100);
    return () => clearInterval(timer);
  }, [phase]);

  const handleTogglePause = useCallback(() => {
    setPhase(prev => {
      if (prev === 'running') return 'paused';
      if (prev === 'paused') return 'running';
      return prev;
    });
  }, []);

  // Hỗ trợ phím tắt ESC để Tạm dừng / Tiếp tục
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && (phase === 'running' || phase === 'paused')) {
        handleTogglePause();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, handleTogglePause]);

  const handleRestart = useCallback(() => {
    setStats({ height: 0, maxHeight: 0 });
    setElapsedMs(0);
    setRestartKey(k => k + 1);
    setPhase('running');
  }, []);

  const handleStartGame = useCallback(({ nickname, skinId }) => {
    setPlayerProfile({ nickname, skinId });
    setStats({ height: 0, maxHeight: 0 });
    setElapsedMs(0);
    setRestartKey(k => k + 1);
    setPhase('running');
  }, []);

  const handleExitToMenu = useCallback(() => {
    setStats({ height: 0, maxHeight: 0 });
    setElapsedMs(0);
    setRestartKey(k => k + 1);
    setPhase('ready');
  }, []);

  const handleUpdateStats = useCallback(({ currentHeight, maxHeight }) => {
    setStats({ height: currentHeight, maxHeight });
  }, []);

  const handleGameOver = useCallback(({ finalHeight, finalMaxHeight }) => {
    setStats({ height: finalHeight, maxHeight: finalMaxHeight });
    setPhase('finished');
  }, []);

  return <>
    <h1 className="game-title">Doodle Jump</h1>
    {backend.loading && <p role="status">Đang tải…</p>}
    {backend.error && <div role="alert">
      <p>Chưa tải được game.</p>
      <button onClick={backend.retry}>Thử lại</button>
    </div>}
    {backend.config && (
      <div className="game-layout-container">
        <TopBar
          elapsedMs={elapsedMs}
          phase={phase}
          onTogglePause={phase === 'running' || phase === 'paused' ? handleTogglePause : undefined}
          onRestart={handleRestart}
        />
        <div className="canvas-wrapper">
          <GameCanvas
            config={backend.config}
            showLoopDemo={showLoopDemo}
            restartKey={restartKey}
            isPaused={phase !== 'running'}
            onUpdateStats={handleUpdateStats}
            onGameOver={handleGameOver}
          >
            {/* Thanh HUD nổi: Kỷ lục, Hiện tại, Bảng ĐUA TOP */}
            <FloatingHUD
              currentHeight={stats.height}
              maxHeight={stats.maxHeight}
              nickname={playerProfile.nickname}
            />

            {phase === 'ready' && (
              <StartMenu
                config={backend.config}
                initialNickname={playerProfile.nickname}
                initialSkin={playerProfile.skinId}
                onStartGame={handleStartGame}
                onOpenLeaderboard={() => setShowLeaderboard(true)}
              />
            )}

            <GameOverModal
              phase={phase}
              height={stats.height}
              elapsedMs={elapsedMs}
              nickname={playerProfile.nickname}
              onResume={() => setPhase('running')}
              onRestart={handleRestart}
              onExitToMenu={handleExitToMenu}
            />

            {showLeaderboard && (
              <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
            )}
          </GameCanvas>
        </div>
      </div>
    )}
  </>;
}

