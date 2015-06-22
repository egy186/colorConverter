/* jshint esnext: true */

'use strict';

import hsl2rgb from './hsl2rgb';
import rgb2hsl from './rgb2hsl';
// import polyfill
import './polyfill/numberisfinite';
import './polyfill/stringincludes';
import './polyfill/weakmap';

const round = Math.round;

const PrivateProperties = () => {
  const wm = new WeakMap();
  //return self => wm.get(self) || wm.set(self, Object.create(null)).get(self);
  // `WeakMap.prototype.set` does not return `this` in IE11
  return self => wm.get(self) || (wm.set(self, Object.create(null)), wm.get(self));
};

const toHex = n => ('0' + n.toString(16)).slice(-2);

const ColorConfig = (() => {
  const privateProperties = new PrivateProperties();

  const sync = function (changedColorScheme) {
    const pp = privateProperties(this);
    switch (changedColorScheme) {
      case 'rgb':
        [pp.h, pp.s, pp.l] = rgb2hsl([this.r, this.g, this.b]);
        return true;
      case 'hsl':
        [pp.r, pp.g, pp.b] = hsl2rgb([this.h, this.s, this.l]);
        return true;
      default:
        return false;
    }
  };

  const setNumber = function (key, value) {
    value = parseFloat(value);
    if (Number.isFinite(value)) {
      privateProperties(this)[key] = value;
      if ('rgb'.includes(key)) {
        sync.call(this, 'rgb');
      } else if ('hsl'.includes(key)) {
        sync.call(this, 'hsl');
      }
    }
    return value;
  };

  const setHex = function (key, value) {
    value = String(value);
    if (value.length === 1) {
      value += value;
    }
    return setNumber.call(this, key, parseInt(value, 16));
  };

  const setString = function (key, value) {
    value = value.replace(/[rgbhsla();\s]/g, '').split(',').map(parseFloat);
    const pp = privateProperties(this);
    for (let i = 0; i < Math.min(key.length, value.length); i++) {
      if (Number.isFinite(value[i])) {
        pp[key[i]] = value[i];
      }
    }
    sync.call(this, key.substr(0, 3));
    return value;
  };

  return class {
    constructor () {
      const pp = privateProperties(this);
      pp.r = 0;
      pp.g = 0;
      pp.b = 0;
      pp.h = 0;
      pp.s = 0;
      pp.l = 0;
      pp.a = 1;
    }

    get r () {
      return privateProperties(this).r;
    }
    set r (n) {
      return setNumber.call(this, 'r', n);
    }

    get g () {
      return privateProperties(this).g;
    }
    set g (n) {
      return setNumber.call(this, 'g', n);
    }

    get b () {
      return privateProperties(this).b;
    }
    set b (n) {
      return setNumber.call(this, 'b', n);
    }

    get r16 () {
      return toHex(this.r);
    }
    set r16 (s) {
      return setHex.call(this, 'r', s);
    }

    get g16 () {
      return toHex(this.g);
    }
    set g16 (s) {
      return setHex.call(this, 'g', s);
    }

    get b16 () {
      return toHex(this.b);
    }
    set b16 (s) {
      return setHex.call(this, 'b', s);
    }

    get h () {
      return privateProperties(this).h;
    }
    set h (n) {
      return setNumber.call(this, 'h', n);
    }

    get s () {
      return privateProperties(this).s;
    }
    set s (n) {
      return setNumber.call(this, 's', n);
    }

    get l () {
      return privateProperties(this).l;
    }
    set l (n) {
      return setNumber.call(this, 'l', n);
    }

    get a () {
      return privateProperties(this).a;
    }
    set a (n) {
      return setNumber.call(this, 'a', n);
    }

    get rgb () {
      return `rgb(${round(this.r)}, ${round(this.g)}, ${round(this.b)})`;
    }
    set rgb (s) {
      return setString.call(this, 'rgb', s);
    }

    get rgba () {
      return `rgba(${round(this.r)}, ${round(this.g)}, ${round(this.b)}, ${this.a})`;
    }
    set rgba (s) {
      return setString.call(this, 'rgba', s);
    }

    get hsl () {
      return `hsl(${round(this.h)}, ${round(this.s)}%, ${round(this.l)}%)`;
    }
    set hsl (s) {
      return setString.call(this, 'hsl', s);
    }

    get hsla () {
      return `hsla(${round(this.h)}, ${round(this.s)}%, ${round(this.l)}%, ${this.a})`;
    }
    set hsla (s) {
      return setString.call(this, 'hsla', s);
    }

    get hex () {
      return '#' + this.r16 + this.g16 + this.b16;
    }
    set hex (s) {
      s = s.replace('#', '');
      let length = 2;
      if (s.length === 3) {
        length = 1;
      } else if (s.length !== 6) {
        s = (s + '000000').substr(0, 6);
      }
      setHex.call(this, 'r', s.substr(0, length));
      setHex.call(this, 'g', s.substr(length, length));
      setHex.call(this, 'b', s.substr(length * 2, length));
    }

    toString () {
      return JSON.stringify(privateProperties(this));
    }
  };
})();

export default ColorConfig;
