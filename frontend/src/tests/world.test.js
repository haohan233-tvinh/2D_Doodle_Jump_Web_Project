import { describe, it, expect } from 'vitest';
import {
  createWorld,
  createPlatformTier,
  updatePlatforms,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  PLATFORM_WIDTH,
  PLATFORM_HEIGHT,
  PLATFORM_TYPES,
} from '../game/world.js';

describe('world.js - Procedural Generation & Multi-Platform Tiers', () => {
  it('createWorld() generates platforms procedurally with a start platform near bottom', () => {
    const world = createWorld();
    expect(world.cameraY).toBe(0);

    // Phải có nhiều bệ (mỗi tầng 3-4 bệ + 1 bệ bắt đầu)
    expect(world.platforms.length).toBeGreaterThanOrEqual(10);

    // Bệ đầu tiên là bệ chuẩn căn giữa dưới chân nhân vật
    const startPlatform = world.platforms[0];
    expect(startPlatform.type).toBe('standard');
    expect(startPlatform.y).toBe(SCREEN_HEIGHT - 110);
    expect(startPlatform.width).toBe(PLATFORM_WIDTH);

    // Tất cả bệ đều có cùng kích thước
    for (const p of world.platforms) {
      expect(p.width).toBe(PLATFORM_WIDTH);
      expect(p.height).toBe(PLATFORM_HEIGHT);
    }

    // Bệ cao nhất phải phủ hết màn hình
    const highestY = Math.min(...world.platforms.map(p => p.y));
    expect(highestY).toBeLessThanOrEqual(50);
  });

  it('createWorld() produces different layouts on each call', () => {
    const world1 = createWorld();
    const world2 = createWorld();
    const xs1 = world1.platforms.map(p => p.x).join(',');
    const xs2 = world2.platforms.map(p => p.x).join(',');
    expect(xs1).not.toBe(xs2);
  });

  it('uses correct screen dimensions', () => {
    expect(SCREEN_WIDTH).toBe(960);
    expect(SCREEN_HEIGHT).toBe(540);
    expect(PLATFORM_WIDTH).toBe(120);
  });

  it('createPlatformTier() spawns 3 or 4 platforms with the exact same size', () => {
    for (let testRun = 0; testRun < 20; testRun++) {
      const tierY = -100 - testRun * 50;
      const tierPlatforms = createPlatformTier(tierY, SCREEN_WIDTH);

      // Mỗi tầng có 3 hoặc 4 bệ
      expect(tierPlatforms.length).toBeGreaterThanOrEqual(3);
      expect(tierPlatforms.length).toBeLessThanOrEqual(4);

      for (const p of tierPlatforms) {
        expect(p.width).toBe(PLATFORM_WIDTH);
        expect(p.height).toBe(PLATFORM_HEIGHT);
      }

      expect(tierPlatforms.reduce((sum, p) => sum + p.width, 0)).toBe(PLATFORM_WIDTH * tierPlatforms.length);
    }
  });

  it('createPlatformTier() keeps ALL platforms within screen bounds (no overflow)', () => {
    for (let testRun = 0; testRun < 50; testRun++) {
      const tierPlatforms = createPlatformTier(-200);

      for (const p of tierPlatforms) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x + p.width).toBeLessThanOrEqual(SCREEN_WIDTH);
      }
    }
  });

  it('createPlatformTier() splits platforms with positive horizontal gaps', () => {
    for (let testRun = 0; testRun < 20; testRun++) {
      const tierPlatforms = createPlatformTier(-200);

      for (let i = 0; i < tierPlatforms.length - 1; i++) {
        const gap = tierPlatforms[i + 1].x - (tierPlatforms[i].x + tierPlatforms[i].width);
        expect(gap).toBeGreaterThanOrEqual(25);
      }
    }
  });

  it('createPlatformTier() assigns valid platform types and avoids all-fragile trap tiers', () => {
    const validTypes = Object.values(PLATFORM_TYPES);

    for (let testRun = 0; testRun < 30; testRun++) {
      const tierPlatforms = createPlatformTier(-300);

      tierPlatforms.forEach(p => {
        expect(validTypes).toContain(p.type);
      });

      const hasSolid = tierPlatforms.some(p => p.type !== PLATFORM_TYPES.FRAGILE);
      expect(hasSolid).toBe(true);
    }
  });

  it('updatePlatforms() dynamically spawns new tiers as camera moves up', () => {
    const world = createWorld();
    const initialCount = world.platforms.length;

    world.cameraY = -600;
    updatePlatforms(world);

    const highestY = Math.min(...world.platforms.map(p => p.y));
    expect(highestY).toBeLessThanOrEqual(-800);
    expect(world.platforms.length).toBeGreaterThan(initialCount);
  });

  it('updatePlatforms() removes offscreen platforms below the camera view', () => {
    const world = createWorld();
    world.cameraY = -200;
    updatePlatforms(world);

    const lowestY = Math.max(...world.platforms.map(p => p.y));
    expect(lowestY - world.cameraY).toBeLessThanOrEqual(550);
  });

  it('updatePlatforms() updates moving platforms horizontally with velocity and bounds', () => {
    const world = {
      platforms: [
        {
          x: 100,
          y: 200,
          width: PLATFORM_WIDTH,
          height: PLATFORM_HEIGHT,
          type: PLATFORM_TYPES.MOVING,
          vx: 80,
          minX: 50,
          maxX: 400,
        },
      ],
      cameraY: 0,
    };

    const dt = 0.5;
    updatePlatforms(world, dt);
    expect(world.platforms[0].x).toBeCloseTo(140, 1);

    // Thử va chạm mép phải: maxX - width = 400 - 120 = 280
    world.platforms[0].x = 275;
    world.platforms[0].vx = 80;
    updatePlatforms(world, 0.5);
    expect(world.platforms[0].vx).toBeLessThan(0);
  });
});
