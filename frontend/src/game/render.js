export function render(ctx, { player, world }) {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = '#edf2e9';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#d6ded1';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  for (let y = 0; y < height; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  ctx.fillStyle = '#43765c';
  for (const platform of world.platforms) ctx.fillRect(platform.x, platform.y - world.cameraY, platform.width, platform.height);
  ctx.fillStyle = '#e8ad48';
  ctx.fillRect(player.x, player.y - world.cameraY, player.width, player.height);
  ctx.fillStyle = '#17352e';
  ctx.fillRect(player.x + 8, player.y + 10 - world.cameraY, 4, 6);
  ctx.fillRect(player.x + 23, player.y + 10 - world.cameraY, 4, 6);
}
