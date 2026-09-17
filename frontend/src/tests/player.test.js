import { describe, it, expect } from 'vitest';
import { createPlayer, updateHorizontal } from '../game/player.js';

describe('player & updateHorizontal (FE-01)', () => {
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

  it('đi phải 30 bước dt = 1/60 từ x = 300 phải tới x = 420', () => {
    const player = createPlayer();
    const dt = 1 / 60;

    for (let i = 0; i < 30; i += 1) {
      updateHorizontal(player, 1, dt);
    }

    expect(player.x).toBeCloseTo(420, 5);
  });

  it('đi trái 30 bước dt = 1/60 từ x = 300 phải tới x = 180', () => {
    const player = createPlayer();
    const dt = 1 / 60;

    for (let i = 0; i < 30; i += 1) {
      updateHorizontal(player, -1, dt);
    }

    expect(player.x).toBeCloseTo(180, 5);
  });

  it('chia cùng khoảng thời gian 0.5s thành bước nhỏ hơn vẫn ra cùng vị trí x = 420', () => {
    const player = createPlayer();
    const dt = 1 / 120; // 60 bước * (1/120) = 0.5s

    for (let i = 0; i < 60; i += 1) {
      updateHorizontal(player, 1, dt);
    }

    expect(player.x).toBeCloseTo(420, 5);
  });

  it('hướng 0 (nhấn cả trái lẫn phải hoặc thả cả hai) thì nhân vật đứng yên', () => {
    const player = createPlayer();
    const dt = 1 / 60;

    // Nhấn cả hai: direction = Number(true) - Number(true) = 0
    updateHorizontal(player, 0, dt);
    expect(player.x).toBe(300);

    // Không nhấn gì: direction = 0
    updateHorizontal(player, 0, 1.0);
    expect(player.x).toBe(300);
  });

  it('chỉ thay đổi x, giữ nguyên y, width, height, vx, vy', () => {
    const player = createPlayer();
    updateHorizontal(player, 1, 0.1);

    expect(player.x).toBeCloseTo(300 + 1 * 240 * 0.1, 5);
    expect(player.y).toBe(388);
    expect(player.width).toBe(34);
    expect(player.height).toBe(42);
    expect(player.vx).toBe(0);
    expect(player.vy).toBe(0);
  });
});
