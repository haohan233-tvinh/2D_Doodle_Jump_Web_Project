import React, { useState, useEffect } from 'react';
import RaceHUD, { DEFAULT_RACE_ABILITIES } from './RaceHUD.jsx';

/**
 * Mock data & Demo Component cho RaceHUD (UI-01)
 * Giúp người kiểm thử và Trưởng nhóm xem trước giao diện trực quan
 * có ghi rõ nhãn "Dữ liệu demo" theo đúng yêu cầu Issue #29.
 */
export const MOCK_RACERS_DEMO = [
  { id: 'player', name: 'Bạn (Doodle)', progress: 68, isPlayer: true, avatar: '🐸' },
  { id: 'bot-1', name: 'Thầy Sơn', progress: 82, isPlayer: false, avatar: '🧙‍♂️' },
  { id: 'bot-2', name: 'Thầy Việt', progress: 54, isPlayer: false, avatar: '🤖' },
  { id: 'bot-3', name: 'Minh Tấn', progress: 40, isPlayer: false, avatar: '🐱' },
];

export function RaceHUDDemo() {
  const [matchState, setMatchState] = useState('racing');
  const [placement, setPlacement] = useState(2);
  const [progress, setProgress] = useState(68);
  const [isStunned, setIsStunned] = useState(false);
  const [stunRemaining, setStunRemaining] = useState(2.0);
  const [abilities, setAbilities] = useState(
    DEFAULT_RACE_ABILITIES.map((a, i) => ({
      ...a,
      cooldown: i === 1 ? 4.5 : 0, // Kỹ năng số 2 (Stun) đang có cooldown 4.5s demo
    }))
  );
  const [screenMode, setScreenMode] = useState('fullscreen'); // 'fullscreen' (tối đa 16:9), 'stretch' (100% tràn viền), 'standard' (960x540) hoặc 'mobile' (390px)
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  // Lắng nghe sự kiện F11 / Fullscreen của trình duyệt
  useEffect(() => {
    const handleFsChange = () => {
      setIsBrowserFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Đếm ngược Cooldown và Hiệu ứng choáng tự động trong Demo
  useEffect(() => {
    const timer = setInterval(() => {
      // Giảm cooldown kỹ năng
      setAbilities((prev) =>
        prev.map((ability) => {
          if (ability.cooldown > 0) {
            const nextCd = Math.max(0, ability.cooldown - 0.1);
            return {
              ...ability,
              cooldown: Number(nextCd.toFixed(1)),
              ready: nextCd === 0,
            };
          }
          return ability;
        })
      );

      // Giảm thời gian choáng nếu đang bật
      if (isStunned) {
        setStunRemaining((prev) => {
          if (prev <= 0.1) {
            setIsStunned(false);
            return 2.0;
          }
          return Number((prev - 0.1).toFixed(1));
        });
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isStunned]);

  // Xử lý khi bấm nút dùng kỹ năng trong Demo
  const handleUseAbility = (abilityId) => {
    setAbilities((prev) =>
      prev.map((ability) => {
        if (ability.id === abilityId) {
          return {
            ...ability,
            cooldown: ability.maxCooldown,
            ready: false,
            active: true,
          };
        }
        return ability;
      })
    );

    // Tắt trạng thái active sau 1s để mô phỏng
    setTimeout(() => {
      setAbilities((prev) =>
        prev.map((ability) => (ability.id === abilityId ? { ...ability, active: false } : ability))
      );
    }, 1000);
  };

  const statusEffects = isStunned
    ? [{ id: 'stunned', name: 'Bị choáng!', icon: '💫', remaining: stunRemaining }]
    : [];

  return (
    <div className="race-hud-demo-wrapper">
      {/* Bảng điều khiển xem thử (Demo Control Toolbar) */}
      <aside className="demo-control-toolbar" aria-label="Bảng điều khiển kiểm thử giao diện">
        <div className="toolbar-group">
          <span className="toolbar-label">Trạng thái:</span>
          {['waiting', 'racing', 'finished', 'disconnected'].map((state) => (
            <button
              key={state}
              type="button"
              className={`btn-toolbar ${matchState === state ? 'is-active' : ''}`}
              onClick={() => setMatchState(state)}
            >
              {state === 'waiting' && '⏳ Chờ phòng'}
              {state === 'racing' && '🏃 Đang đua'}
              {state === 'finished' && '🏁 Về đích'}
              {state === 'disconnected' && '⚠️ Mất mạng'}
            </button>
          ))}
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Thứ hạng:</span>
          {[1, 2, 3, 4].map((r) => (
            <button
              key={r}
              type="button"
              className={`btn-toolbar ${placement === r ? 'is-active' : ''}`}
              onClick={() => setPlacement(r)}
            >
              #{r}
            </button>
          ))}
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Hiệu ứng:</span>
          <button
            type="button"
            className={`btn-toolbar btn-toggle-stun ${isStunned ? 'is-active' : ''}`}
            onClick={() => {
              setIsStunned(!isStunned);
              setStunRemaining(2.0);
            }}
          >
            💫 {isStunned ? 'Đang Choáng (Bật)' : 'Thử Choáng'}
          </button>
        </div>

        <div className="toolbar-group">
          <span className="toolbar-label">Khung hình:</span>
          <button
            type="button"
            className={`btn-toolbar ${screenMode === 'fullscreen' ? 'is-active' : ''}`}
            onClick={() => setScreenMode('fullscreen')}
            title="Mở rộng tối đa theo màn hình (Tỉ lệ chuẩn 16:9)"
          >
            🖥️ Toàn màn hình
          </button>
          <button
            type="button"
            className={`btn-toolbar ${screenMode === 'stretch' ? 'is-active' : ''}`}
            onClick={() => setScreenMode('stretch')}
            title="Tràn viền 100% không gian cửa sổ"
          >
            ⛶ Tràn viền (100%)
          </button>
          <button
            type="button"
            className={`btn-toolbar ${screenMode === 'standard' ? 'is-active' : ''}`}
            onClick={() => setScreenMode('standard')}
            title="Kích thước pixel gốc 960x540"
          >
            📺 960x540
          </button>
          <button
            type="button"
            className={`btn-toolbar ${screenMode === 'mobile' ? 'is-active' : ''}`}
            onClick={() => setScreenMode('mobile')}
            title="Giao diện mô phỏng điện thoại di động"
          >
            📱 Mobile (390px)
          </button>
          <button
            type="button"
            className={`btn-toolbar btn-fs-toggle ${isBrowserFullscreen ? 'is-active' : ''}`}
            onClick={toggleBrowserFullscreen}
            title="Bật/Tắt chế độ Toàn Màn Hình của trình duyệt (F11)"
          >
            {isBrowserFullscreen ? '🗗 Thu nhỏ F11' : '⛶ F11 Toàn Màn Hình'}
          </button>
        </div>
      </aside>

      {/* Khung mô phỏng Gameplay kèm RaceHUD */}
      <div className={`demo-screen-container mode-${screenMode}`}>
        <div className="demo-canvas-simulated">
          {/* Nền mô phỏng game doodle jump sinh động */}
          <div className="simulated-gameplay-stage" aria-hidden="true">
            {/* Các sàn bệ nhảy mẫu (sử dụng % để co giãn linh hoạt ở mọi độ phân giải) */}
            <div className="sim-platform plat-1" style={{ bottom: '16%', left: '42%' }}>
              <img src="/images/skins/platform-standard.svg" alt="" />
            </div>
            <div className="sim-platform plat-2" style={{ bottom: '32%', left: '26%' }}>
              <img src="/images/skins/platform-moving.svg" alt="" />
            </div>
            <div className="sim-platform plat-3" style={{ bottom: '48%', left: '55%' }}>
              <img src="/images/skins/platform-standard.svg" alt="" />
            </div>
            <div className="sim-platform plat-4" style={{ bottom: '63%', left: '35%' }}>
              <img src="/images/skins/platform-fragile.svg" alt="" />
            </div>
            <div className="sim-platform plat-5" style={{ bottom: '77%', left: '48%' }}>
              <img src="/images/skins/platform-standard.svg" alt="" />
            </div>

            {/* Nhân vật Doodle nhảy nhót */}
            <div className="sim-doodle-player" style={{ bottom: '18%', left: '42%' }}>
              <img src="/images/skins/doodle.svg" alt="" className="sim-doodle-sprite" />
              <span className="sim-doodle-name">Bạn (Doodle)</span>
            </div>

            {/* Đối thủ bot mô phỏng */}
            <div className="sim-bot-player" style={{ bottom: '70%', left: '36%' }}>
              <img src="/images/skins/purple.svg" alt="" className="sim-bot-sprite" />
              <span className="sim-bot-name">Thầy Sơn 🧙‍♂️</span>
            </div>
          </div>

          {/* Component RaceHUD chuẩn */}
          <RaceHUD
            matchState={matchState}
            progress={progress}
            distanceToFinish={320}
            totalDistance={1000}
            currentDistance={680}
            racers={MOCK_RACERS_DEMO}
            placement={placement}
            totalRacers={4}
            abilities={abilities}
            onUseAbility={handleUseAbility}
            statusEffects={statusEffects}
            winner={{ id: 'bot-1', name: 'Thầy Sơn', placement: 1, isPlayer: false }}
            isDemo={true}
            demoLabel="Dữ liệu demo (UI-01 / Race V2)"
            onPlayAgain={() => {
              setMatchState('racing');
              setProgress(10);
            }}
            onLeaveRoom={() => setMatchState('waiting')}
            onRetryConnection={() => setMatchState('racing')}
          />
        </div>
      </div>
    </div>
  );
}

export default RaceHUDDemo;
