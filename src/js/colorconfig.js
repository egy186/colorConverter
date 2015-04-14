/* jshint esnext: true */

'use strict';

import hsl2rgb from './hsl2rgb';
import rgb2hsl from './rgb2hsl';

let isNumber = n => {
  return !Number.isNaN(n) && Number.isFinite(n);
};

class ColorConfig {
  constructor () {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.h = 0;
    this.s = 0;
    this.l = 0;
    this.a = 1;
  }
  set (key, value) {
    if (key.length === 1) {
      value = parseFloat(value);
      if (this.hasOwnProperty(key) && isNumber(value)) {
        this[key] = value;
        if ('rgb'.contains(key)) {
          this.sync('rgb');
        } else if ('hsl'.contains(key)) {
          this.sync('hsl');
        }
      }
    } else if (key === 'rgb' || key === 'rgba') {
      let rgba = ['r', 'g', 'b', 'a'];
      value = value.replace(/[rgba();\s]/g, '').split(',').map(parseFloat);
      for (let i = 0; i < Math.min(rgba.length, value.length); i++) {
        if (isNumber(value[i])) {
          this[rgba[i]] = value[i];
        }
      }
      this.sync('rgb');
    } else if (key === 'hsl' || key === 'hsla') {
      let hsla = ['h', 's', 'l', 'a'];
      value = value.replace(/[hsla();\s]/g, '').split(',').map(parseFloat);
      for (let i = 0; i < Math.min(hsla.length, value.length); i++) {
        if (isNumber(value[i])) {
          this[hsla[i]] = value[i];
        }
      }
      this.sync('hsl');
    } else if (key === 'hex') {
      value = value.replace('#', '');
      if (value.length === 3) {
        let r = parseInt(value.substr(0, 1), 16),
            g = parseInt(value.substr(1, 1), 16),
            b = parseInt(value.substr(2, 1), 16);
        this.r = r + r * 16;
        this.g = g + g * 16;
        this.b = b + b * 16;
      } else {
        if (value.length !== 6) {
          value = (value + '000000').slice(0, 6);
        }
        this.r = parseInt(value.substr(0, 2), 16);
        this.g = parseInt(value.substr(2, 2), 16);
        this.b = parseInt(value.substr(4, 2), 16);
      }
      this.sync('rgb');
    }
  }
  sync (changedColorScheme) {
    switch (changedColorScheme) {
      case 'rgb':
        [this.h, this.s, this.l] = rgb2hsl([this.r, this.g, this.b]);
        break;
      case 'hsl':
        [this.r, this.g, this.b] = hsl2rgb([this.h, this.s, this.l]);
        break;
    }
  }
  toString (colorScheme = '') {
    switch (colorScheme.toLowerCase()) {
      case 'rgb':
        return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
      case 'rgba':
        return `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, ${this.a})`;
      case 'hsl':
        return `hsl(${Math.round(this.h)}, ${Math.round(this.s)}%, ${Math.round(this.l)}%)`;
      case 'hsla':
        return `hsla(${Math.round(this.h)}, ${Math.round(this.s)}%, ${Math.round(this.l)}%, ${this.a})`;
      case 'hex':
        return '#' + ('000000' + (this.r * 65536 + this.g * 256 + this.b).toString(16)).slice(-6);
      default:
        return JSON.stringify(this);
    }
  }
}

export default ColorConfig;
