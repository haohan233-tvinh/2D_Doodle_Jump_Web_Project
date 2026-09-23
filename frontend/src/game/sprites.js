const cache = new Map();

function prepare(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = pixels;
  const width = canvas.width;
  const height = canvas.height;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  function add(index) {
    if (visited[index]) return;
    visited[index] = 1;
    const offset = index * 4;
    if (data[offset + 3] === 0 || (
      data[offset] > 238 && data[offset + 1] > 238 && data[offset + 2] > 238
    )) queue[tail++] = index;
  }

  for (let x = 0; x < width; x += 1) { add(x); add((height - 1) * width + x); }
  for (let y = 0; y < height; y += 1) { add(y * width); add(y * width + width - 1); }
  while (head < tail) {
    const index = queue[head++];
    data[index * 4 + 3] = 0;
    if (index % width) add(index - 1);
    if (index % width < width - 1) add(index + 1);
    if (index >= width) add(index - width);
    if (index < width * (height - 1)) add(index + width);
  }

  let left = width, top = height, right = 0, bottom = 0;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    if (data[(y * width + x) * 4 + 3] > 0) {
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  ctx.putImageData(pixels, 0, 0);
  return { image: canvas, x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

export function getSprite(id) {
  if (typeof Image === 'undefined' || typeof document === 'undefined') return null;
  if (!cache.has(id)) {
    cache.set(id, null);
    const image = new Image();
    image.onload = () => {
      try { cache.set(id, prepare(image)); } catch { cache.set(id, null); }
    };
    image.src = `/images/sprites/${id}.png`;
  }
  return cache.get(id);
}

export function drawSprite(ctx, id, x, y, width, height) {
  const sprite = getSprite(id);
  if (!sprite) return false;
  ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height,
    x, y, width, height);
  return true;
}
