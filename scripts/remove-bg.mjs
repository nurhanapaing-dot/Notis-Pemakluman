import sharp from 'sharp';

async function processImage() {
  const inputPath = 'public/assets/aistudio/jkrpd_a47039ed.jpg';
  const outputPath = 'public/assets/aistudio/jkrpd_transparent.png';

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 4 (RGBA)

  const visited = new Uint8Array(width * height);
  const isOuterBg = new Uint8Array(width * height);

  function isWhiteOrNearWhite(idx) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // Background is near white (RGB > 215, saturation < 30)
    return min > 215 && (max - min) < 30;
  }

  const queue = [];

  // Seed BFS from all borders
  for (let x = 0; x < width; x++) {
    const topIdx = (0 * width + x) * channels;
    if (isWhiteOrNearWhite(topIdx)) {
      queue.push(x, 0);
      visited[0 * width + x] = 1;
    }
    const bottomIdx = ((height - 1) * width + x) * channels;
    if (isWhiteOrNearWhite(bottomIdx)) {
      queue.push(x, height - 1);
      visited[(height - 1) * width + x] = 1;
    }
  }

  for (let y = 0; y < height; y++) {
    const leftIdx = (y * width + 0) * channels;
    if (isWhiteOrNearWhite(leftIdx) && !visited[y * width + 0]) {
      queue.push(0, y);
      visited[y * width + 0] = 1;
    }
    const rightIdx = (y * width + (width - 1)) * channels;
    if (isWhiteOrNearWhite(rightIdx) && !visited[y * width + (width - 1)]) {
      queue.push(width - 1, y);
      visited[y * width + (width - 1)] = 1;
    }
  }

  // BFS Flood Fill
  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    isOuterBg[cy * width + cx] = 1;

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!visited[nPos]) {
          visited[nPos] = 1;
          const nIdx = nPos * channels;
          if (isWhiteOrNearWhite(nIdx)) {
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // Set alpha = 0 for outer background and clean any JPEG artifact edge
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      const idx = pos * channels;
      if (isOuterBg[pos]) {
        data[idx + 3] = 0;
      } else {
        // Check if neighboring outer background
        let hasOuterNeighbor = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isOuterBg[ny * width + nx]) {
                hasOuterNeighbor = true;
                break;
              }
            }
          }
          if (hasOuterNeighbor) break;
        }

        if (hasOuterNeighbor) {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const min = Math.min(r, g, b);
          // If it's a faded whitish edge pixel, make it transparent
          if (min > 220) {
            data[idx + 3] = 0;
          } else if (min > 180) {
            data[idx + 3] = Math.round(((220 - min) / 40) * 255);
          }
        }
      }
    }
  }

  // Save trimmed PNG (removes unnecessary transparent padding)
  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
    .trim()
    .png({ quality: 100 })
    .toFile(outputPath);

  const trimmedMeta = await sharp(outputPath).metadata();
  console.log(`Trimmed transparent logo saved: ${trimmedMeta.width}x${trimmedMeta.height}`);
}

processImage().catch(console.error);
