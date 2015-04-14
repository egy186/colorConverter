/* jshint esnext: true */

'use strict';

let hsl2rgb = (hsl) => {
  let [h, s, l] = hsl;
  while (h < 0) {
    h += 360;
  }
  while (h > 360) {
    h -= 360;
  }
  s /= 100;
  l /= 100;
  let c = s * (1 - Math.abs(2 * l - 1)),
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c / 2,
      r, g, b;
  if (s === 0) {
    return [l, l, l];
  } else {
    if (h < 60) {
      r = c + m;
      g = x + m;
      b = m;
    } else if (h < 120) {
      r = x + m;
      g = c + m;
      b = m;
    } else if (h < 180) {
      r = m;
      g = c + m;
      b = x + m;
    } else if (h < 240) {
      r = m;
      g = x + m;
      b = c + m;
    } else if (h < 300) {
      r = x + m;
      g = m;
      b = c + m;
    } else {
      r = c + m;
      g = m;
      b = x + m;
    }
    return [Math.round(255 * r), Math.round(255 * g), Math.round(255 * b)];
  }
};

export default hsl2rgb;
