// Canvas coordinates: positive Y points down. Horizontal movement belongs to FE-01.
import { isLandingOnPlatform } from './collision.js';
export const GRAVITY = 1200;
export const MAX_VY = 900;
export const JUMP_VELOCITY = -520;
export function applyPhysics(player, dt) {
  player.prevY = player.y;
  player.vy = Math.min(MAX_VY, player.vy + GRAVITY * dt);
  player.y += player.vy * dt;
}
export function handlePlatformCollisions(player, platforms) {
  const landing = platforms.filter(p => !p.broken && isLandingOnPlatform(player, p)).sort((a,b) => a.y-b.y)[0];
  if (!landing) return null;
  player.y = landing.y - player.height;
  player.vy = JUMP_VELOCITY * (landing.type === 'bouncy' ? landing.bounceMultiplier || 1.45 : 1);
  if (landing.type === 'fragile') landing.broken = true;
  return landing;
}
export function handleScreenWrap(player, width) {
  if (player.x > width) player.x = -player.width;
  else if (player.x + player.width < 0) player.x = width;
}
