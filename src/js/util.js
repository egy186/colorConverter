/* jshint esnext: true */

'use strict';

const util = {
  randomInt: (from, to) => from + Math.floor(Math.random() * (to - from + 1)),
  rgba: (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`,
  hsla: (h, s, l, a) => `hsla(${h}, ${s}%, ${l}%, ${a})`,
  linearGradient: (deg, ...colors) => `linear-gradient(${deg}deg, ${colors.join(', ') })`
};

export default util;
