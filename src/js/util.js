export const randomInt = (from, to) => from + Math.floor(Math.random() * (to - from + 1));

export const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

export const hsla = (h, s, l, a) => `hsla(${h}, ${s}%, ${l}%, ${a})`;

export const linearGradient = (deg, ...colors) => `linear-gradient(${deg}deg, ${colors.join(', ') })`;
