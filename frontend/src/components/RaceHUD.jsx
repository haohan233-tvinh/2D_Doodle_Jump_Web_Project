import React from 'react';

/**
 * RaceHUD - Heads-Up Display cho chế độ Đua Race V2
 * 
 * Đáp ứng phạm vi công việc Issue #29 (UI-01):
 * - Nhận toàn bộ dữ liệu qua props: tiến độ tới đích, thứ hạng, siêu năng lực (bay, choáng, teleport), cooldown, trạng thái tác động, người thắng.
 * - Hỗ trợ 4 trạng thái trận đấu: 'waiting' | 'racing' | 'finished' | 'disconnected'
 * - Thiết kế tối ưu không che gameplay, tương thích khung chuẩn 960x540 và màn hình chạm hẹp.
 * - Hỗ trợ nhãn dữ liệu demo rõ ràng.
 */

// Danh sách cấu hình mặc định cho 3 siêu năng lực chuẩn Race V2
export const DEFAULT_RACE_ABILITIES = [
  {
    id: 'fly',
    name: 'Bay siêu tốc',
    shortName: 'Bay',
    icon: '🚀',
    keyHint: '1',
    cooldown: 0,
    maxCooldown: 12,
    ready: true,
    active: false,
    duration: 3,
    description: 'Tăng tốc bay thẳng lên cao trong 3 giây',
  },
  {
    id: 'stun',
    name: 'Tia sét choáng',
    shortName: 'Choáng',
    icon: '⚡',
    keyHint: '2',
    cooldown: 0,
    maxCooldown: 15,
    ready: true,
    active: false,
    duration: 2,
    description: 'Làm choáng đối thủ gần nhất trong 2 giây',
  },
  {
    id: 'teleport',
    name: 'Dịch chuyển',
    shortName: 'Teleport',
    icon: '🌀',
    keyHint: '3',
    cooldown: 0,
    maxCooldown: 20,
    ready: true,
    active: false,
    duration: 0,
    description: 'Dịch chuyển tức thời lên bệ cao hơn',
  },
];

export function RaceHUD({
  // 1. Trạng thái trận đấu: 'waiting' | 'racing' | 'finished' | 'disconnected'
  matchState = 'racing',

  // 2. Tiến độ tới đích
  progress = 0, // Tiến độ của người chơi (0 - 100%)
  distanceToFinish = 0, // Khoảng cách còn lại tới vạch đích (mét)
  totalDistance = 1000, // Chiều dài đường đua
  currentDistance = 0, // Khoảng cách người chơi đã leo
  racers = [], // Danh sách các tay đua trên đường đua: [{ id, name, progress, isPlayer, avatar }]

  // 3. Thứ hạng hiện tại
  placement = 1, // Thứ hạng người chơi: 1, 2, 3, 4,...
  totalRacers = 4, // Tổng số tay đua trong phòng

  // 4. Siêu năng lực & Cooldown
  abilities = DEFAULT_RACE_ABILITIES,
  onUseAbility, // Callback: (abilityId) => void

  // 5. Trạng thái tác động (Effects / Debuffs)
  statusEffects = [], // Ví dụ: [{ id: 'stunned', name: 'Bị choáng!', icon: '💫', remaining: 1.8 }]

  // 6. Thông báo người chiến thắng
  winner = null, // { id, name, placement, timeMs, isPlayer }

  // 7. Nhãn demo
  isDemo = false,
  demoLabel = 'Dữ liệu demo (UI-01)',

  // 8. Callbacks điều khiển
  onPlayAgain,
  onLeaveRoom,
  onRetryConnection,
}) {
  // Chuẩn hóa danh sách tay đua trên thanh tiến trình
  const safeRacers = racers.length > 0
    ? racers
    : [
        { id: 'player', name: 'Bạn', progress: Math.min(100, Math.max(0, progress)), isPlayer: true },
      ];

  // Tìm tay đua đang dẫn đầu
  const leader = [...safeRacers].sort((a, b) => (b.progress || 0) - (a.progress || 0))[0];

  // Kiểm tra người chơi có đang bị hiệu ứng choáng hay không
  const stunEffect = statusEffects.find((eff) => eff.id === 'stunned' || eff.type === 'stunned');

  return (
    <div
      className={`race-hud-container state-${matchState} ${stunEffect ? 'has-stun-effect' : ''}`}
      aria-label="Giao diện cuộc đua Race V2"
    >
      {/* 1. Nhãn Demo rõ ràng theo quy định */}
      {isDemo && (
        <aside className="race-demo-badge" data-testid="race-demo-badge" aria-label="Chế độ demo">
          <span className="demo-dot" />
          <span className="demo-text">{demoLabel}</span>
        </aside>
      )}

      {/* 2. Cảnh báo màn hình khi bị choáng (Viền vignette vàng, không cản gameplay) */}
      {stunEffect && (
        <div
          className="race-stun-vignette"
          aria-hidden="true"
          data-testid="race-stun-vignette"
        />
      )}

      {/* =========================================================================
          KHU VỰC TOP HUD: TIẾN ĐỘ TỚI ĐÍCH & THỨ HẠNG (KHÔNG CHE GAMEPLAY Ở GIỮA)
          ========================================================================= */}
      <header className="race-hud-topbar" aria-label="Thanh tiến độ cuộc đua">
        {/* Thẻ thứ hạng góc trên bên trái */}
        <div className="race-placement-card" data-testid="race-placement" aria-live="polite">
          <span className="placement-label">HẠNG</span>
          <div className="placement-number-group">
            <span className={`placement-rank rank-${placement}`}>
              #{placement}
            </span>
            <span className="placement-total">/{totalRacers}</span>
          </div>
        </div>

        {/* Thanh tiến trình cuộc đua ở trung tâm trên cùng */}
        <section
          className="race-progress-section"
          aria-label={`Tiến độ cuộc đua: Bạn đang đạt ${Math.round(progress)}%`}
          data-testid="race-progress-track"
        >
          <div className="race-progress-header">
            <span className="track-marker-start">🏁 Xuất phát</span>
            <span className="track-distance-info" data-testid="race-distance-info">
              {distanceToFinish > 0
                ? `Còn ${Math.round(distanceToFinish)}m đến đích`
                : `${Math.round(currentDistance || (progress / 100) * totalDistance)}m / ${totalDistance}m`}
            </span>
            <span className="track-marker-finish">🏆 Đích</span>
          </div>

          <div className="race-track-rail">
            {/* Vạch tiến độ đã đi của người chơi */}
            <div
              className="race-track-fill"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              data-testid="race-track-fill"
            />

            {/* Các điểm tay đua di chuyển trên thanh ray */}
            {safeRacers.map((racer) => {
              const clampedProgress = Math.min(100, Math.max(0, racer.progress || 0));
              return (
                <div
                  key={racer.id}
                  className={`racer-pin ${racer.isPlayer ? 'is-player-pin' : 'is-bot-pin'}`}
                  style={{ left: `${clampedProgress}%` }}
                  title={`${racer.name}: ${Math.round(clampedProgress)}%`}
                  data-testid={`racer-pin-${racer.id}`}
                >
                  <span className="racer-pin-avatar">
                    {racer.isPlayer ? '🐸' : racer.avatar || '🤖'}
                  </span>
                  <span className="racer-pin-name">{racer.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cụm thông tin tay đua dẫn đầu */}
        <div className="race-lead-card" aria-label="Người dẫn đầu">
          <span className="lead-tag">DẪN ĐẦU</span>
          <span className="lead-name" data-testid="race-leader-name">
            {leader ? leader.name : '—'}
          </span>
        </div>
      </header>

      {/* =========================================================================
          TRẠNG THÁI TÁC ĐỘNG: BANNER BỊ CHOÁNG (STUNNED)
          Hiển thị lơ lửng phía trên nhân vật, không che khuất sàn nhảy ở giữa
          ========================================================================= */}
      {stunEffect && (
        <aside
          className="race-status-banner stun-banner"
          data-testid="race-stun-banner"
          role="alert"
          aria-live="assertive"
        >
          <span className="status-banner-icon" aria-hidden="true">💫</span>
          <div className="status-banner-body">
            <strong className="status-banner-title">BỊ CHOÁNG!</strong>
            <span className="status-banner-desc">
              Tạm thời bất động ({Number(stunEffect.remaining || 0).toFixed(1)}s)
            </span>
          </div>
        </aside>
      )}

      {/* =========================================================================
          KHU VỰC BOTTOM HUD: THANH SIÊU NĂNG LỰC & COOLDOWN
          Bố trí góc dưới tiện thao tác chạm trên mobile / kích thước phím to
          ========================================================================= */}
      {matchState === 'racing' && (
        <footer className="race-hud-bottombar" aria-label="Thanh siêu năng lực">
          <nav className="race-abilities-dock" aria-label="Các kỹ năng siêu năng lực">
            {abilities.map((ability) => {
              const isOnCooldown = ability.cooldown > 0;
              const isActive = Boolean(ability.active);
              const isReady = !isOnCooldown && (ability.ready ?? true);
              const cooldownSeconds = Number(ability.cooldown || 0).toFixed(1);

              return (
                <button
                  key={ability.id}
                  type="button"
                  className={`race-ability-btn ability-${ability.id} ${
                    isReady ? 'is-ready' : 'is-cooldown'
                  } ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    if (isReady && onUseAbility) {
                      onUseAbility(ability.id);
                    }
                  }}
                  disabled={isOnCooldown}
                  title={`${ability.name} (${ability.description || ''})`}
                  aria-label={`${ability.name}: ${
                    isOnCooldown ? `Đang hồi ${cooldownSeconds} giây` : 'Sẵn sàng dùng'
                  }`}
                  data-testid={`ability-btn-${ability.id}`}
                >
                  {/* Phím tắt gợi ý (1, 2, 3) */}
                  {ability.keyHint && (
                    <kbd className="ability-key-hint">{ability.keyHint}</kbd>
                  )}

                  {/* Icon năng lực */}
                  <span className="ability-icon" aria-hidden="true">
                    {ability.icon}
                  </span>

                  {/* Tên năng lực */}
                  <span className="ability-name">{ability.shortName || ability.name}</span>

                  {/* Lớp phủ Cooldown với đồng hồ đếm ngược */}
                  {isOnCooldown && (
                    <div
                      className="ability-cooldown-overlay"
                      data-testid={`cooldown-${ability.id}`}
                      aria-hidden="true"
                    >
                      <span className="cooldown-counter">{cooldownSeconds}s</span>
                    </div>
                  )}

                  {/* Viền sáng khi đang kích hoạt */}
                  {isActive && <span className="ability-active-glow" aria-hidden="true" />}
                </button>
              );
            })}
          </nav>
        </footer>
      )}

      {/* =========================================================================
          TRẠNG THÁI 1: CHƯA VÀO PHÒNG / PHÒNG CHỜ (WAITING)
          ========================================================================= */}
      {matchState === 'waiting' && (
        <section
          className="race-modal-overlay state-overlay-waiting"
          role="region"
          aria-label="Phòng chờ trận đua"
          data-testid="race-waiting-overlay"
        >
          <div className="race-modal-box">
            <div className="modal-spinner" aria-hidden="true" />
            <h2 className="race-modal-title">🏁 PHÒNG CHỜ RACE V2</h2>
            <p className="race-modal-desc">
              Đang ghép đối thủ vào đường đua ({safeRacers.length}/{totalRacers})...
            </p>
            <div className="waiting-racers-list">
              {safeRacers.map((r) => (
                <div key={r.id} className="waiting-racer-chip">
                  <span>{r.isPlayer ? '🐸' : '🤖'}</span>
                  <span>{r.name}</span>
                </div>
              ))}
            </div>
            {onLeaveRoom && (
              <button
                type="button"
                className="btn-race-secondary"
                onClick={onLeaveRoom}
                data-testid="btn-leave-room"
              >
                Rời phòng
              </button>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          TRẠNG THÁI 2: MẤT KẾT NỐI (DISCONNECTED)
          ========================================================================= */}
      {matchState === 'disconnected' && (
        <section
          className="race-modal-overlay state-overlay-disconnected"
          role="alertdialog"
          aria-labelledby="disconnect-title"
          data-testid="race-disconnected-overlay"
        >
          <div className="race-modal-box alert-card">
            <span className="modal-alert-icon" aria-hidden="true">⚠️</span>
            <h2 id="disconnect-title" className="race-modal-title alert-title">
              MẤT KẾT NỐI MẠNG
            </h2>
            <p className="race-modal-desc">
              Đường truyền tới máy chủ cuộc đua bị gián đoạn. Đang thử kết nối lại...
            </p>
            <div className="race-modal-actions">
              {onRetryConnection && (
                <button
                  type="button"
                  className="btn-race-primary"
                  onClick={onRetryConnection}
                  data-testid="btn-retry-connection"
                >
                  🔄 Thử kết nối lại
                </button>
              )}
              {onLeaveRoom && (
                <button
                  type="button"
                  className="btn-race-secondary"
                  onClick={onLeaveRoom}
                >
                  🏠 Thoát ra sảnh
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TRẠNG THÁI 3: VỀ ĐÍCH / THÔNG BÁO NGƯỜI THẮNG (FINISHED)
          ========================================================================= */}
      {matchState === 'finished' && (
        <section
          className="race-modal-overlay state-overlay-finished"
          role="dialog"
          aria-labelledby="winner-title"
          data-testid="race-finished-overlay"
        >
          <div className="race-modal-box victory-card">
            <span className="victory-trophy" aria-hidden="true">🏆</span>
            <h2 id="winner-title" className="race-modal-title victory-title">
              {winner?.isPlayer || placement === 1
                ? '🎉 BẠN ĐÃ CHIẾN THẮNG! 🎉'
                : '🏁 CUỘC ĐUA KẾT THÚC!'}
            </h2>

            {/* Thông báo người chiến thắng */}
            <div className="race-winner-banner" data-testid="race-winner-announcement">
              <span className="winner-crown">👑</span>
              <span className="winner-label">Người về nhất:</span>
              <strong className="winner-name">
                {winner ? winner.name : leader ? leader.name : 'Người chơi'}
              </strong>
            </div>

            {/* Tóm tắt thứ hạng của bạn */}
            <div className="race-player-summary">
              <span className="summary-placement">
                Thứ hạng của bạn: <strong>#{placement}</strong> / {totalRacers}
              </span>
            </div>

            <div className="race-modal-actions">
              {onPlayAgain && (
                <button
                  type="button"
                  className="btn-race-primary"
                  onClick={onPlayAgain}
                  data-testid="btn-race-play-again"
                >
                  🔄 Đua tiếp ván mới
                </button>
              )}
              {onLeaveRoom && (
                <button
                  type="button"
                  className="btn-race-secondary"
                  onClick={onLeaveRoom}
                >
                  🏠 Quay về Menu
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default RaceHUD;
