import { useState } from 'react';
import GamePage from './pages/GamePage.jsx';
import RaceHUDDemo from './components/RaceHUDDemo.jsx';

export default function App() {
  const [showRaceDemo, setShowRaceDemo] = useState(
    () => new URLSearchParams(window.location.search).get('demo') === 'race'
  );

  return (
    <main>
      {showRaceDemo ? <RaceHUDDemo /> : <GamePage />}
      <button
        type="button"
        style={{
          position: 'fixed',
          bottom: '8px',
          right: '8px',
          zIndex: 9999,
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 'bold',
          background: showRaceDemo ? '#3b82f6' : '#f59e0b',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          opacity: 0.85,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
        onClick={() => setShowRaceDemo((prev) => !prev)}
        title="Chuyển đổi giữa Game chính và Demo HUD Race V2"
      >
        {showRaceDemo ? '🎮 Về Game Chính' : '🏁 Xem Demo Race HUD (UI-01)'}
      </button>
    </main>
  );
}
