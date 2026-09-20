export function render(ctx, { player, world }) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  // World and canvas use the same coordinates.
  ctx.fillStyle = '#43765c';
  for (const platform of world.platforms) {
    if (platform.broken) continue;
    ctx.fillStyle = { moving: '#397fa0', fragile: '#ad7351', bouncy: '#8654ae' }[platform.type] || '#43765c';
    ctx.fillRect(platform.x, platform.y - world.cameraY, platform.width, platform.height);
  }
  ctx.fillStyle = '#e8ad48';
  ctx.fillRect(player.x, player.y - world.cameraY, player.width, player.height);
  ctx.fillStyle = '#17352e';
  ctx.fillRect(player.x + 8, player.y + 10 - world.cameraY, 4, 6);
  ctx.fillRect(player.x + 23, player.y + 10 - world.cameraY, 4, 6);
  ctx.restore();
}
