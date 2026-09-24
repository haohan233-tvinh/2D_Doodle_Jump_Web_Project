import { SCREEN_HEIGHT, SCREEN_WIDTH } from './index.js';
import { drawSprite } from './sprites.js';

function drawFallback(ctx, x, y, ghost = false) {
  ctx.save();
  ctx.globalAlpha = ghost ? 0.55 : 1;
  ctx.fillStyle = '#e8ad48';
  ctx.fillRect(x, y, 38, 48);
  ctx.fillStyle = '#17352e';
  ctx.fillRect(x + 8, y + 11, 4, 6);
  ctx.fillRect(x + 25, y + 11, 4, 6);
  ctx.restore();
}

function drawCharacter(ctx, spriteId, x, y, width, height, ghost = false) {
  ctx.save();
  ctx.globalAlpha = ghost ? 0.72 : 1;
  if (!drawSprite(ctx, spriteId, x, y, width, height)) drawFallback(ctx, x, y, ghost);
  ctx.restore();
}

export function render(ctx, { player, world, bots = [], config = {}, elapsedMs = 0 }) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  const cameraY = world.cameraY;

  ctx.font = '12px monospace';
  ctx.lineWidth = 1;
  for (let mark = 0; mark <= (config.finish_height || 3000); mark += 250) {
    const y = 430 - mark - cameraY;
    if (y < 0 || y > SCREEN_HEIGHT) continue;
    ctx.strokeStyle = '#4d6b5a33';
    ctx.setLineDash([3, 8]);
    ctx.beginPath(); ctx.moveTo(14, y); ctx.lineTo(SCREEN_WIDTH - 14, y); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#5b7567';
    ctx.fillText(`${mark}m`, 16, y - 8);
  }

  const finishY = 388 - (config.finish_height || 3000) - cameraY;
  if (finishY > -30 && finishY < SCREEN_HEIGHT) {
    for (let x = 0; x < SCREEN_WIDTH; x += 16) {
      ctx.fillStyle = x % 32 ? '#faf7e9' : '#365b45';
      ctx.fillRect(x, finishY, 16, 8);
    }
    ctx.fillStyle = '#365b45'; ctx.font = 'bold 18px sans-serif';
    ctx.fillText('ĐÍCH', 450, finishY - 12);
  }

  for (const platform of world.platforms) {
    if (platform.broken) continue;
    const y = platform.y - cameraY;
    if (y < -24 || y > SCREEN_HEIGHT) continue;
    const type = platform.type === 'fragile' ? 'fragile'
      : platform.type === 'moving' ? 'moving' : 'standard';
    if (!drawSprite(ctx, `platform-${type}`, platform.x, y, platform.width, platform.height)) {
      ctx.fillStyle = type === 'fragile' ? '#ad7351' : type === 'moving' ? '#397fa0' : '#43765c';
      ctx.fillRect(platform.x, y, platform.width, platform.height);
    }
    if (platform.type === 'bouncy') {
      ctx.strokeStyle = '#6c3da0'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(platform.x + platform.width / 2 - 8, y);
      ctx.lineTo(platform.x + platform.width / 2 + 7, y - 7);
      ctx.lineTo(platform.x + platform.width / 2 - 6, y - 14);
      ctx.stroke();
    }
  }

  bots.forEach((bot) => {
    if (bot.isDead) return;
    const y = (bot.y !== undefined ? bot.y : (388 - bot.progress)) - cameraY;
    if (y < -80 || y > SCREEN_HEIGHT + 20) return;
    const x = bot.x !== undefined ? bot.x : (bot.lane || 100);
    drawCharacter(ctx, bot.sprite_id, x, y, bot.width || 42, bot.height || 52, true);
    ctx.fillStyle = '#345244';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(bot.name, x - 3, y - 6);
  });

  drawCharacter(ctx, player.sprite_id, player.x, player.y - cameraY,
    player.width + 8, player.height + 10);
  ctx.restore();
}
