const rgb2hsl = (rgb) => {
  rgb = rgb.map(n => n / 255);
  const max = Math.max(...rgb),
        min = Math.min(...rgb),
        sum = max + min,
        delta = max - min,
        [r, g, b] = rgb;
  let h = 0,
      s = 0;
  const l = sum * 50;
  if (delta !== 0) {
    switch (max) {
      case r:
        h = 60 * (g - b) / delta;
        break;
      case g:
        h = 120 + 60 * (b - r) / delta;
        break;
      case b:
        h = 240 + 60 * (r - g) / delta;
        break;
    }
    if (h < 0) {
      h += 360;
    }
    if (l < 50) {
      s = delta * 100 / sum;
    } else {
      s = delta * 100 / (2 - sum);
    }
  }
  return [Math.round(h), Math.round(s), Math.round(l)];
};

export default rgb2hsl;
