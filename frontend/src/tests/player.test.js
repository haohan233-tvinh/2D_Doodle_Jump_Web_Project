import { describe, it, expect } from 'vitest';
import { createPlayer, updateHorizontal } from '../game/player.js';

describe('player & updateHorizontal (FE-01 + Inertia Physics)', () => {
  it('createPlayer tạo đúng dữ liệu ban đầu theo quy ước', () => {
    const player = createPlayer();
    expect(player).toEqual({
      x: 300,
      y: 388,
      width: 34,
      height: 42,
      vx: 0,
      vy: 0,
    });
  });

  it('đi phải 30 bước dt = 1/60 từ x = 300 tăng tốc đạt max_vx và tới x = 464.5', () => {
    const player = createPlayer();
    const dt = 1 / 60;

    for (let i = 0; i < 30; i += 1) {
      updateHorizontal(player, 1, dt);
    }

    expect(player.x).toBeCloseTo(464.5, 1);
    expect(player.vx).toBe(420);
    expect(player.direction).toBe('right');
  });

  it('đi trái 30 bước dt = 1/60 từ x = 300 tăng tốc đạt -max_vx và tới x = 135.5', () => {
    const player = createPlayer();
    const dt = 1 / 60;

    for (let i = 0; i < 30; i += 1) {
      updateHorizontal(player, -1, dt);
    }

    expect(player.x).toBeCloseTo(135.5, 1);
    expect(player.vx).toBe(-420);
    expect(player.direction).toBe('left');
  });

  it('chia cùng khoảng thời gian 0.5s thành 60 bước dt = 1/120 tăng tốc mượt', () => {
    const player = createPlayer();
    const dt = 1 / 120; // 60 bước * (1/120) = 0.5s

    for (let i = 0; i < 60; i += 1) {
      updateHorizontal(player, 1, dt);
    }

    expect(player.x).toBeCloseTo(462.75, 1);
    expect(player.vx).toBe(420);
  });

  it('hướng 0 khi đứng yên thì nhân vật không di chuyển', () => {
    const player = createPlayer();
    const dt = 1 / 60;

    // Nhấn cả hai: direction = Number(true) - Number(true) = 0
    updateHorizontal(player, 0, dt);
    expect(player.x).toBe(300);
    expect(player.vx).toBe(0);

    // Không nhấn gì: direction = 0
    updateHorizontal(player, 0, 1.0);
    expect(player.x).toBe(300);
    expect(player.vx).toBe(0);
  });

  it('nhả phím khi đang có trớn: ma sát trượt hãm tốc độ về 0', () => {
    const player = createPlayer({ vx: 180 });
    // dt = 0.05s, ma sát 2000px/s^2 hãm 100px/s -> vx còn 80
    updateHorizontal(player, 0, 0.05);
    expect(player.vx).toBe(80);

    // Thêm 0.05s nữa -> vx hãm tiếp về 0 (không bị âm)
    updateHorizontal(player, 0, 0.05);
    expect(player.vx).toBe(0);
  });

  it('chỉ thay đổi x và vx, giữ nguyên y, width, height, vy', () => {
    const player = createPlayer();
    updateHorizontal(player, 1, 0.1);

    expect(player.x).toBeCloseTo(318, 1);
    expect(player.y).toBe(388);
    expect(player.width).toBe(34);
    expect(player.height).toBe(42);
    expect(player.vx).toBe(180);
    expect(player.vy).toBe(0);
  });
});
