(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/* jshint esnext: true */
/* jshint browser: true */

'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _ColorConfig = require('./colorconfig');

var _ColorConfig2 = _interopRequireWildcard(_ColorConfig);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function isCallable(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function toInteger(value) {
      var number = Number(value);
      if (isNaN(number)) {
        return 0;
      }
      if (number === 0 || !isFinite(number)) {
        return number;
      }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function toLength(value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike /*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike === null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  })();
}

var rgba = function rgba(r, g, b, a) {
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};
var hsla = function hsla(h, s, l, a) {
  return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
};
var linearGradient = function linearGradient(deg) {
  for (var _len = arguments.length, colors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    colors[_key - 1] = arguments[_key];
  }

  return 'linear-gradient(' + deg + 'deg, ' + colors.join(', ') + ')';
};

var colorConfig = new _ColorConfig2['default'](),
    tabs = undefined,
    tabList = ['rgb', 'rgba', 'hsl', 'hsla', 'hex'],

// select tab
currentTab = tabList[0],
    navTabs = undefined,

// main
formInput = undefined,
    formOutput = undefined,
    layerBgColor = undefined,
    inputRangeSts = undefined;

var update = function update() {
  if (currentTab === 'rgba' || currentTab === 'hsla') {
    layerBgColor.style.backgroundColor = colorConfig.toString('hsla');
    if (colorConfig.l > 50 || colorConfig.a < 0.5) {
      layerBgColor.setAttribute('class', 'theme-light');
    } else {
      layerBgColor.setAttribute('class', 'theme-dark');
    }
  } else {
    layerBgColor.style.backgroundColor = colorConfig.toString('hsl');
    if (colorConfig.l > 50) {
      layerBgColor.setAttribute('class', 'theme-light');
    } else {
      layerBgColor.setAttribute('class', 'theme-dark');
    }
  }
};

// main
var main = function main(key, value) {
  // set colorConfig
  if (/^num16/.test(key)) {
    if (value.length === 1) {
      value = String(value) + String(value);
    }
    value = parseInt(value, 16);
  }
  colorConfig.set(key.replace(/^\S+-/, ''), value);
  // set values
  var inputValues = {
    'text-rgb': colorConfig.toString('rgb'),
    'text-rgba': colorConfig.toString('rgba'),
    'text-hsl': colorConfig.toString('hsl'),
    'text-hsla': colorConfig.toString('hsla'),
    'text-hex': colorConfig.toString('hex'),
    'num-r': colorConfig.r,
    'num-g': colorConfig.g,
    'num-b': colorConfig.b,
    'num-h': colorConfig.h,
    'num-s': colorConfig.s,
    'num-l': colorConfig.l,
    'num-a': colorConfig.a,
    'range-r': colorConfig.r,
    'range-g': colorConfig.g,
    'range-b': colorConfig.b,
    'range-h': colorConfig.h,
    'range-s': colorConfig.s,
    'range-l': colorConfig.l,
    'range-a': colorConfig.a,
    'num16-r': ('0' + colorConfig.r.toString(16)).slice(-2),
    'num16-g': ('0' + colorConfig.g.toString(16)).slice(-2),
    'num16-b': ('0' + colorConfig.b.toString(16)).slice(-2) };
  delete inputValues[key];
  for (var inputKey in inputValues) {
    if (!inputValues.hasOwnProperty(inputKey)) {
      continue;
    }
    formInput[inputKey].value = inputValues[inputKey];
  }
  // form-output
  formOutput['output-rgb'].value = colorConfig.toString('rgb');
  formOutput['output-rgba'].value = colorConfig.toString('rgba');
  formOutput['output-hsl'].value = colorConfig.toString('hsl');
  formOutput['output-hsla'].value = colorConfig.toString('hsla');
  formOutput['output-hex'].value = colorConfig.toString('hex');
  formOutput['output-permalink'].value = global.location.toString() + '#' + currentTab + '&' + JSON.stringify(colorConfig);
  // range
  inputRangeSts[0].backgroundImage = linearGradient(90, rgba(0, colorConfig.g, colorConfig.b, 1), rgba(255, colorConfig.g, colorConfig.b, 1));
  inputRangeSts[1].backgroundImage = linearGradient(90, rgba(colorConfig.r, 0, colorConfig.b, 1), rgba(colorConfig.g, 255, colorConfig.b, 1));
  inputRangeSts[2].backgroundImage = linearGradient(90, rgba(colorConfig.r, colorConfig.g, 0, 1), rgba(colorConfig.r, colorConfig.g, 255, 1));
  inputRangeSts[3].backgroundImage = linearGradient(90, hsla(0, colorConfig.s, colorConfig.l, 1), hsla(60, colorConfig.s, colorConfig.l, 1), hsla(120, colorConfig.s, colorConfig.l, 1), hsla(180, colorConfig.s, colorConfig.l, 1), hsla(240, colorConfig.s, colorConfig.l, 1), hsla(300, colorConfig.s, colorConfig.l, 1), hsla(360, colorConfig.s, colorConfig.l, 1));
  inputRangeSts[4].backgroundImage = linearGradient(90, hsla(colorConfig.h, 0, colorConfig.l, 1), hsla(colorConfig.h, 100, colorConfig.l, 1));
  inputRangeSts[5].backgroundImage = linearGradient(90, hsla(colorConfig.h, colorConfig.s, 0, 1), hsla(colorConfig.h, colorConfig.s, 50, 1), hsla(colorConfig.h, colorConfig.s, 100, 1));
  inputRangeSts[6].background = linearGradient(90, rgba(colorConfig.r, colorConfig.g, colorConfig.b, 0), rgba(colorConfig.r, colorConfig.g, colorConfig.b, 1));
  // set CSS
  update();
};

// select tab
var changeTab = function changeTab(newTab) {
  var newTabIndex = tabList.indexOf(newTab);
  if (newTabIndex === -1) {
    return;
  }
  // forms
  tabs.forEach(function (el) {
    return el.forEach(function (el) {
      return el.style.display = 'none';
    });
  });
  tabs[newTabIndex].forEach(function (el) {
    return el.style.display = '';
  });
  // nav-tab
  navTabs[tabList.indexOf(currentTab)].parentElement.classList.remove('active');
  navTabs[newTabIndex].parentElement.classList.add('active');
  // set new tab
  currentTab = newTab;
  // update
  update();
};

// init
global.addEventListener('load', function () {
  // set global var
  navTabs = Array.from(global.document.getElementById('nav-tab').getElementsByTagName('a'));
  tabs = [Array.from(global.document.getElementsByClassName('rgb')), Array.from(global.document.getElementsByClassName('rgba')), Array.from(global.document.getElementsByClassName('hsl')), Array.from(global.document.getElementsByClassName('hsla')), Array.from(global.document.getElementsByClassName('hex'))];
  formInput = global.document.getElementById('form-input');
  formOutput = global.document.getElementById('form-output');
  layerBgColor = global.document.getElementById('layer-bgcolor');
  inputRangeSts = [global.document.getElementById('range-r').style, global.document.getElementById('range-g').style, global.document.getElementById('range-b').style, global.document.getElementById('range-h').style, global.document.getElementById('range-s').style, global.document.getElementById('range-l').style, global.document.getElementById('range-a').style];
  // init dom
  for (var i = 0; i < tabList.length; i++) {
    navTabs[i].setAttribute('href', '#' + tabList[i]);
  }
  // add event
  global.document.getElementById('nav-tab').addEventListener('click', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'a') {
      evt.preventDefault();
      evt.target.blur();
      changeTab(evt.target.getAttribute('href').slice(1));
    }
  }, false);
  formInput.addEventListener('change', function (evt) {
    return main(evt.target.id, evt.target.value);
  }, false);
  formInput.addEventListener('input', function (evt) {
    return main(evt.target.id, evt.target.value);
  }, false);
  var formOutputInputs = formOutput.getElementsByTagName('input');
  for (var i = 0; i < formOutputInputs.length; i++) {
    formOutputInputs[i].addEventListener('focus', function (evt) {
      return evt.target.select();
    }, false);
  }
  // set tab
  var locationHash = global.location.hash.slice(1),
      scheme = locationHash.replace(/&\S*$/, '').toLowerCase();
  if (tabList.indexOf(scheme) !== -1) {
    changeTab(scheme);
  } else {
    changeTab(tabList[Math.floor(Math.random() * 5)]);
  }
  // set color
  try {
    var config = JSON.parse(locationHash.replace(/^\S*&/, ''));
    for (var key in config) {
      if (!config.hasOwnProperty(key)) {
        continue;
      }
      colorConfig.set(key, config[key]);
    }
    main('num-r', colorConfig.r);
    formInput['num-r'].value = colorConfig.r;
  } catch (err) {
    var textRgba = rgba(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1);
    main('text-rgba', textRgba);
    formInput['text-rgba'].value = textRgba;
  }
  history.replaceState({}, '', location.href.replace(/\#.*/, ''));
}, false);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./colorconfig":2}],2:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _hsl2rgb3 = require('./hsl2rgb');

var _hsl2rgb4 = _interopRequireWildcard(_hsl2rgb3);

var _rgb2hsl3 = require('./rgb2hsl');

var _rgb2hsl4 = _interopRequireWildcard(_rgb2hsl3);

/* jshint esnext: true */

'use strict';

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
Number.isNaN = Number.isNaN || function (value) {
  return typeof value === 'number' && value !== value;
};
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
Number.isFinite = Number.isFinite || function (value) {
  return typeof value === 'number' && isFinite(value);
};
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
if (!String.prototype.includes) {
  String.prototype.includes = function () {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

var isNumber = function isNumber(n) {
  return !Number.isNaN(n) && Number.isFinite(n);
};

var ColorConfig = (function () {
  function ColorConfig() {
    _classCallCheck(this, ColorConfig);

    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.h = 0;
    this.s = 0;
    this.l = 0;
    this.a = 1;
  }

  _createClass(ColorConfig, [{
    key: 'set',
    value: function set(key, value) {
      if (key.length === 1) {
        value = parseFloat(value);
        if (this.hasOwnProperty(key) && isNumber(value)) {
          this[key] = value;
          if ('rgb'.includes(key)) {
            this.sync('rgb');
          } else if ('hsl'.includes(key)) {
            this.sync('hsl');
          }
        }
      } else if (key === 'rgb' || key === 'rgba') {
        var rgba = ['r', 'g', 'b', 'a'];
        value = value.replace(/[rgba();\s]/g, '').split(',').map(parseFloat);
        for (var i = 0; i < Math.min(rgba.length, value.length); i++) {
          if (isNumber(value[i])) {
            this[rgba[i]] = value[i];
          }
        }
        this.sync('rgb');
      } else if (key === 'hsl' || key === 'hsla') {
        var hsla = ['h', 's', 'l', 'a'];
        value = value.replace(/[hsla();\s]/g, '').split(',').map(parseFloat);
        for (var i = 0; i < Math.min(hsla.length, value.length); i++) {
          if (isNumber(value[i])) {
            this[hsla[i]] = value[i];
          }
        }
        this.sync('hsl');
      } else if (key === 'hex') {
        value = value.replace('#', '');
        if (value.length === 3) {
          var r = parseInt(value.substr(0, 1), 16),
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
  }, {
    key: 'sync',
    value: function sync(changedColorScheme) {
      switch (changedColorScheme) {
        case 'rgb':
          var _rgb2hsl = _rgb2hsl4['default']([this.r, this.g, this.b]);

          var _rgb2hsl2 = _slicedToArray(_rgb2hsl, 3);

          this.h = _rgb2hsl2[0];
          this.s = _rgb2hsl2[1];
          this.l = _rgb2hsl2[2];

          break;
        case 'hsl':
          var _hsl2rgb = _hsl2rgb4['default']([this.h, this.s, this.l]);

          var _hsl2rgb2 = _slicedToArray(_hsl2rgb, 3);

          this.r = _hsl2rgb2[0];
          this.g = _hsl2rgb2[1];
          this.b = _hsl2rgb2[2];

          break;
      }
    }
  }, {
    key: 'toString',
    value: function toString() {
      var colorScheme = arguments[0] === undefined ? '' : arguments[0];

      switch (colorScheme.toLowerCase()) {
        case 'rgb':
          return 'rgb(' + Math.round(this.r) + ', ' + Math.round(this.g) + ', ' + Math.round(this.b) + ')';
        case 'rgba':
          return 'rgba(' + Math.round(this.r) + ', ' + Math.round(this.g) + ', ' + Math.round(this.b) + ', ' + this.a + ')';
        case 'hsl':
          return 'hsl(' + Math.round(this.h) + ', ' + Math.round(this.s) + '%, ' + Math.round(this.l) + '%)';
        case 'hsla':
          return 'hsla(' + Math.round(this.h) + ', ' + Math.round(this.s) + '%, ' + Math.round(this.l) + '%, ' + this.a + ')';
        case 'hex':
          return '#' + ('000000' + (this.r * 65536 + this.g * 256 + this.b).toString(16)).slice(-6);
        default:
          return JSON.stringify(this);
      }
    }
  }]);

  return ColorConfig;
})();

exports['default'] = ColorConfig;
module.exports = exports['default'];

},{"./hsl2rgb":3,"./rgb2hsl":4}],3:[function(require,module,exports){
'use strict';

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/* jshint esnext: true */

'use strict';

var hsl2rgb = function hsl2rgb(hsl) {
  var _hsl = _slicedToArray(hsl, 3);

  var h = _hsl[0];
  var s = _hsl[1];
  var l = _hsl[2];

  while (h < 0) {
    h += 360;
  }
  while (h > 360) {
    h -= 360;
  }
  s /= 100;
  l /= 100;
  var c = s * (1 - Math.abs(2 * l - 1)),
      x = c * (1 - Math.abs(h / 60 % 2 - 1)),
      m = l - c / 2,
      r = undefined,
      g = undefined,
      b = undefined;
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

exports['default'] = hsl2rgb;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/* jshint esnext: true */

'use strict';

var rgb2hsl = function rgb2hsl(rgb) {
  rgb = rgb.map(function (n) {
    return n / 255;
  });
  var max = Math.max.apply(Math, _toConsumableArray(rgb));
  var min = Math.min.apply(Math, _toConsumableArray(rgb));
  var sum = max + min;
  var delta = max - min;
  var _rgb = _slicedToArray(rgb, 3);

  var r = _rgb[0];
  var g = _rgb[1];

  var b = _rgb[2];
  var h = 0;
  var s = 0;
  var l = sum * 50;
  if (delta === 0) {
    return [0, 0, l];
  } else {
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
    return [Math.round(h), Math.round(s), Math.round(l)];
  }
};

exports['default'] = rgb2hsl;
module.exports = exports['default'];

},{}]},{},[1]);
