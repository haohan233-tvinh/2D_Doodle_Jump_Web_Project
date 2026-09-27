import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HUD, { RaceHUD, DEFAULT_RACE_ABILITIES } from '../components/HUD.jsx';

afterEach(cleanup);

describe('RaceHUD Component (Issue #29 - UI-01: Race V2 HUD)', () => {
  const mockRacers = [
    { id: 'player', name: 'Bạn (Doodle)', progress: 65, isPlayer: true },
    { id: 'bot-1', name: 'Thầy Sơn', progress: 80, isPlayer: false },
    { id: 'bot-2', name: 'Thầy Việt', progress: 50, isPlayer: false },
  ];

  it('renders race progress and distance to finish line', () => {
    render(
      <RaceHUD
        matchState="racing"
        progress={65}
        distanceToFinish={350}
        totalDistance={1000}
        racers={mockRacers}
        placement={2}
        totalRacers={3}
      />
    );

    // Kiểm tra thanh tiến độ và thông tin khoảng cách
    expect(screen.getByTestId('race-progress-track')).toBeDefined();
    expect(screen.getByTestId('race-distance-info').textContent).toContain('350m');
    expect(screen.getByTestId('race-track-fill').style.width).toBe('65%');

    // Kiểm tra các chốt tay đua
    expect(screen.getByTestId('racer-pin-player')).toBeDefined();
    expect(screen.getByTestId('racer-pin-bot-1')).toBeDefined();
  });

  it('renders current placement and leader information', () => {
    render(
      <RaceHUD
        matchState="racing"
        placement={1}
        totalRacers={4}
        racers={mockRacers}
      />
    );

    // Thứ hạng #1 / 4
    const placementElem = screen.getByTestId('race-placement');
    expect(placementElem.textContent).toContain('#1');
    expect(placementElem.textContent).toContain('/4');

    // Người dẫn đầu (Thầy Sơn có progress = 80 cao nhất)
    expect(screen.getByTestId('race-leader-name').textContent).toBe('Thầy Sơn');
  });

  it('renders 3 abilities (fly, stun, teleport) with cooldown states and triggers onUseAbility', () => {
    const onUseAbility = vi.fn();
    const testAbilities = [
      { id: 'fly', name: 'Bay siêu tốc', shortName: 'Bay', icon: '🚀', cooldown: 0, ready: true },
      { id: 'stun', name: 'Tia sét choáng', shortName: 'Choáng', icon: '⚡', cooldown: 4.5, ready: false },
      { id: 'teleport', name: 'Dịch chuyển', shortName: 'Teleport', icon: '🌀', cooldown: 0, ready: true },
    ];

    render(
      <RaceHUD
        matchState="racing"
        abilities={testAbilities}
        onUseAbility={onUseAbility}
      />
    );

    // Kiểm tra đủ 3 nút năng lực
    const flyBtn = screen.getByTestId('ability-btn-fly');
    const stunBtn = screen.getByTestId('ability-btn-stun');
    const teleportBtn = screen.getByTestId('ability-btn-teleport');

    expect(flyBtn).toBeDefined();
    expect(stunBtn).toBeDefined();
    expect(teleportBtn).toBeDefined();

    // Kỹ năng stun đang có cooldown 4.5s
    expect(screen.getByTestId('cooldown-stun').textContent).toContain('4.5s');
    expect(stunBtn.getAttribute('disabled')).not.toBeNull();

    // Kỹ năng fly sẵn sàng, click vào gọi onUseAbility
    fireEvent.click(flyBtn);
    expect(onUseAbility).toHaveBeenCalledWith('fly');

    // Kỹ năng stun bị vô hiệu hóa, click không gọi onUseAbility
    fireEvent.click(stunBtn);
    expect(onUseAbility).not.toHaveBeenCalledWith('stun');
  });

  it('renders stun status effect banner and screen vignette without blocking gameplay', () => {
    const statusEffects = [
      { id: 'stunned', name: 'Bị choáng!', icon: '💫', remaining: 1.8 },
    ];

    render(
      <RaceHUD
        matchState="racing"
        statusEffects={statusEffects}
      />
    );

    // Kiểm tra banner trạng thái choáng
    const banner = screen.getByTestId('race-stun-banner');
    expect(banner.textContent).toContain('BỊ CHOÁNG!');
    expect(banner.textContent).toContain('1.8s');

    // Kiểm tra hiệu ứng viền vignette
    expect(screen.getByTestId('race-stun-vignette')).toBeDefined();
  });

  it('renders waiting lobby overlay when matchState is waiting', () => {
    const onLeaveRoom = vi.fn();
    render(
      <RaceHUD
        matchState="waiting"
        racers={mockRacers}
        totalRacers={4}
        onLeaveRoom={onLeaveRoom}
      />
    );

    expect(screen.getByTestId('race-waiting-overlay')).toBeDefined();
    expect(screen.getByText(/PHÒNG CHỜ RACE V2/i)).toBeDefined();

    const leaveBtn = screen.getByTestId('btn-leave-room');
    fireEvent.click(leaveBtn);
    expect(onLeaveRoom).toHaveBeenCalledTimes(1);
  });

  it('renders disconnected overlay when matchState is disconnected', () => {
    const onRetryConnection = vi.fn();
    render(
      <RaceHUD
        matchState="disconnected"
        onRetryConnection={onRetryConnection}
      />
    );

    expect(screen.getByTestId('race-disconnected-overlay')).toBeDefined();
    expect(screen.getByText(/MẤT KẾT NỐI MẠNG/i)).toBeDefined();

    const retryBtn = screen.getByTestId('btn-retry-connection');
    fireEvent.click(retryBtn);
    expect(onRetryConnection).toHaveBeenCalledTimes(1);
  });

  it('renders victory overlay and winner announcement when matchState is finished', () => {
    const onPlayAgain = vi.fn();
    const winner = { id: 'player', name: 'Bạn (Doodle)', placement: 1, isPlayer: true };

    render(
      <RaceHUD
        matchState="finished"
        winner={winner}
        placement={1}
        totalRacers={4}
        onPlayAgain={onPlayAgain}
      />
    );

    expect(screen.getByTestId('race-finished-overlay')).toBeDefined();
    expect(screen.getByTestId('race-winner-announcement').textContent).toContain('Bạn (Doodle)');
    expect(screen.getByText(/BẠN ĐÃ CHIẾN THẮNG/i)).toBeDefined();

    const playAgainBtn = screen.getByTestId('btn-race-play-again');
    fireEvent.click(playAgainBtn);
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('renders demo badge with custom label when isDemo is true', () => {
    render(<RaceHUD isDemo={true} demoLabel="Dữ liệu demo UI-01" />);
    const badge = screen.getByTestId('race-demo-badge');
    expect(badge.textContent).toContain('Dữ liệu demo UI-01');
  });
});

describe('Original Milestone 1 HUD Component (Quy ước chung)', () => {
  it('renders height, converted seconds and phase status', () => {
    render(
      <HUD
        height={120}
        elapsedMs={12500}
        phase="running"
      />
    );

    expect(screen.getByTestId('hud-height').textContent).toContain('120m');
    expect(screen.getByTestId('hud-timer').textContent).toContain('12.5s');
    expect(screen.getByTestId('hud-phase').textContent).toBe('Đang chơi');
  });

  it('handles ready phase and zero values correctly', () => {
    render(<HUD height={0} elapsedMs={0} phase="ready" />);
    expect(screen.getByTestId('hud-height').textContent).toContain('0m');
    expect(screen.getByTestId('hud-timer').textContent).toContain('0.0s');
    expect(screen.getByTestId('hud-phase').textContent).toBe('Chưa bắt đầu');
  });
});
