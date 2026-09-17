// PHYS-01 · Hoàng Hải Minh
// Cần export applyPhysics(player, dt): lưu prevY, cập nhật vy rồi y.
// Đơn vị giây, pixel và pixel/giây. Chưa viết collision trong PR đầu.
import { GRAVITY, MAX_VELOCITY } from './index.js';

export const Kinematics = {
    velocityAt: (v0, g, t) => v0 - g * t,
    positionAt: (y0, v0, g, t) => y0 + v0 * t - 0.5 * g * t * t,
    peakTime: (v0, g) => v0 / g,
    maxHeight: (v0, g) => (v0 * v0) / (2 * g),
    airTime: (v0, g) => (2 * v0) / g,
    range: (vx, v0, g) => vx * ((2 * v0) / g)
};

export function applyPhysics(body, dt) {
    body.vy += GRAVITY * dt;
    if (body.vy > MAX_VELOCITY) {
        body.vy = MAX_VELOCITY;
    }
    body.x += body.vx * dt;
    body.y += body.vy * dt;
}