import { useCallback, useEffect, useMemo, useState } from 'react';
import GameCanvas from '../components/GameCanvas.jsx';
import { TopBar, FloatingHUD, StartMenu, GameOverModal, LeaderboardModal } from '../components/HUD.jsx';
import { useBackend } from '../hooks/useBackend.js';
import { postJson } from '../services/api.js';
import { getPlayerId, readLocal, writeLocal } from '../services/storage.js';

const EMPTY_STATS = { height: 0, maxHeight: 0, elapsedMs: 0, placement: 1, ranking: [] };

export default function GamePage() {
  const backend = useBackend();
  const showLoopDemo = new URLSearchParams(window.location.search).get('demo') === 'loop';
  const [phase, setPhase] = useState(showLoopDemo ? 'running' : 'ready');
  const [stats, setStats] = useState(EMPTY_STATS);
  const [restartKey, setRestartKey] = useState(0);
  const [playerProfile, setPlayerProfile] = useState(() => ({
    nickname: readLocal('doodle-name', ''),
    skinId: readLocal('doodle-skin', 'nam'),
  }));
  const [runMeta, setRunMeta] = useState(null);
  const [save, setSave] = useState({ status: '', message: '' });
  const [recordMode, setRecordMode] = useState(null);

  const gameConfig = useMemo(() => backend.config ? ({
    ...backend.config,
    nickname: playerProfile.nickname,
    skin_id: playerProfile.skinId,
  }) : null, [backend.config, playerProfile]);

  const newRun = useCallback((profile) => {
    setRunMeta({
      run_id: crypto.randomUUID(),
      player_id: getPlayerId(),
      nickname: profile.nickname,
      skin_id: profile.skinId,
      rules_version: backend.config.rules_version,
    });
  }, [backend.config]);

  const handleTogglePause = useCallback(() => {
    setPhase((current) => current === 'running' ? 'paused' : current === 'paused' ? 'running' : current);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && (phase === 'running' || phase === 'paused')) handleTogglePause();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, handleTogglePause]);

  const handleRestart = useCallback(() => {
    if (!playerProfile.nickname) return;
    setStats(EMPTY_STATS);
    setSave({ status: '', message: '' });
    newRun(playerProfile);
    setRestartKey((key) => key + 1);
    setPhase('running');
  }, [newRun, playerProfile]);

  const handleStartGame = useCallback((profile) => {
    setPlayerProfile(profile);
    writeLocal('doodle-name', profile.nickname);
    writeLocal('doodle-skin', profile.skinId);
    setStats(EMPTY_STATS);
    setSave({ status: '', message: '' });
    newRun(profile);
    setRestartKey((key) => key + 1);
    setPhase('running');
  }, [newRun]);

  const handleExitToMenu = useCallback(() => {
    setStats(EMPTY_STATS);
    setRestartKey((key) => key + 1);
    setPhase('ready');
  }, []);

  const handleUpdateStats = useCallback((value) => {
    setStats({
      height: value.currentHeight,
      maxHeight: value.maxHeight,
      elapsedMs: value.elapsedMs,
      placement: value.placement,
      ranking: value.ranking,
    });
  }, []);

  const handleGameOver = useCallback(async (value) => {
    const result = {
      height: value.finalHeight,
      maxHeight: value.finalMaxHeight,
      elapsedMs: value.elapsedMs,
      placement: value.placement,
      outcome: value.outcome,
      reason: value.reason,
      ranking: stats.ranking,
    };
    setStats((current) => ({ ...current, ...result }));
    setPhase('finished');
    if (!runMeta) return;
    const payload = {
      ...runMeta,
      height: result.height,
      elapsed_ms: result.elapsedMs,
      outcome: result.outcome,
      placement: result.placement,
    };
    writeLocal('doodle-pending', payload);
    setSave({ status: 'saving', message: 'Đang lưu kết quả…' });
    try {
      await postJson('/api/runs', payload);
      writeLocal('doodle-pending', null);
      setSave({ status: 'saved', message: 'Đã lưu kết quả.' });
    } catch (error) {
      setSave({ status: 'error', message: `Chưa lưu được: ${error.message}` });
    }
  }, [runMeta, stats.ranking]);

  if (backend.loading) return <p role="status">Đang tải…</p>;
  if (backend.error) return <div role="alert"><p>Chưa tải được game.</p><button onClick={backend.retry}>Thử lại</button></div>;

  return <>
    <h1 className="game-title">Doodle Jump</h1>
    <div className="game-layout-container">
      <TopBar elapsedMs={stats.elapsedMs} phase={phase}
        onTogglePause={phase === 'running' || phase === 'paused' ? handleTogglePause : undefined}
        onRestart={phase === 'ready' ? undefined : handleRestart} />
      <div className="canvas-wrapper">
        <GameCanvas config={gameConfig} showLoopDemo={showLoopDemo} restartKey={restartKey}
          isPaused={phase !== 'running'} onUpdateStats={handleUpdateStats} onGameOver={handleGameOver}>
          <FloatingHUD currentHeight={stats.height} maxHeight={stats.maxHeight}
            nickname={playerProfile.nickname} ranking={stats.ranking} />

          {phase === 'ready' && <StartMenu config={backend.config}
            initialNickname={playerProfile.nickname} initialSkin={playerProfile.skinId}
            onStartGame={handleStartGame} onOpenLeaderboard={() => setRecordMode('leaderboard')}
            onOpenHistory={() => setRecordMode('history')} />}

          <GameOverModal phase={phase} height={stats.height} elapsedMs={stats.elapsedMs}
            placement={stats.placement} nickname={playerProfile.nickname} save={save}
            onResume={() => setPhase('running')} onRestart={handleRestart}
            onExitToMenu={handleExitToMenu} />

          {recordMode && <LeaderboardModal mode={recordMode} playerId={getPlayerId()}
            rulesVersion={backend.config.rules_version} onClose={() => setRecordMode(null)} />}
        </GameCanvas>
      </div>
    </div>
  </>;
}
