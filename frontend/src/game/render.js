export function render(ctx, { player, world }) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  // Center the existing world without changing physics coordinates.
  ctx.translate((width - 640) / 2, height - 520);
  ctx.fillStyle = '#43765c';
  for (const platform of world.platforms) ctx.fillRect(platform.x, platform.y - world.cameraY, platform.width, platform.height);
  ctx.fillStyle = '#e8ad48';
  ctx.fillRect(player.x, player.y - world.cameraY, player.width, player.height);
  ctx.fillStyle = '#17352e';
  ctx.fillRect(player.x + 8, player.y + 10 - world.cameraY, 4, 6);
  ctx.fillRect(player.x + 23, player.y + 10 - world.cameraY, 4, 6);
  ctx.restore();
}
