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
    tabList = ['rgb', 'rgba', 'hsl', 'hsla', 'hex'];
var tabs = undefined,

// select tab
currentTab = tabList[0],
    navTabs = undefined,

// main
formInput = undefined,
    formOutput = undefined,
    layerBgColor = undefined,
    inputRangeStyles = undefined;

var updateView = function updateView() {
  // form-output
  formOutput['output-rgb'].value = colorConfig.rgb;
  formOutput['output-rgba'].value = colorConfig.rgba;
  formOutput['output-hsl'].value = colorConfig.hsl;
  formOutput['output-hsla'].value = colorConfig.hsla;
  formOutput['output-hex'].value = colorConfig.hex;
  formOutput['output-permalink'].value = global.location.toString() + '#' + currentTab + '&' + colorConfig.toString();
  // set CSS
  if (currentTab === 'rgba' || currentTab === 'hsla') {
    layerBgColor.style.backgroundColor = colorConfig.hsla;
    if (colorConfig.l > 50 || colorConfig.a < 0.5) {
      layerBgColor.setAttribute('class', 'theme-light');
    } else {
      layerBgColor.setAttribute('class', 'theme-dark');
    }
  } else {
    layerBgColor.style.backgroundColor = colorConfig.hsl;
    if (colorConfig.l > 50) {
      layerBgColor.setAttribute('class', 'theme-light');
    } else {
      layerBgColor.setAttribute('class', 'theme-dark');
    }
  }
  // range
  inputRangeStyles['range-r'].backgroundImage = linearGradient(90, rgba(0, colorConfig.g, colorConfig.b, 1), rgba(255, colorConfig.g, colorConfig.b, 1));
  inputRangeStyles['range-g'].backgroundImage = linearGradient(90, rgba(colorConfig.r, 0, colorConfig.b, 1), rgba(colorConfig.r, 255, colorConfig.b, 1));
  inputRangeStyles['range-b'].backgroundImage = linearGradient(90, rgba(colorConfig.r, colorConfig.g, 0, 1), rgba(colorConfig.r, colorConfig.g, 255, 1));
  inputRangeStyles['range-h'].backgroundImage = linearGradient(90, hsla(0, colorConfig.s, colorConfig.l, 1), hsla(60, colorConfig.s, colorConfig.l, 1), hsla(120, colorConfig.s, colorConfig.l, 1), hsla(180, colorConfig.s, colorConfig.l, 1), hsla(240, colorConfig.s, colorConfig.l, 1), hsla(300, colorConfig.s, colorConfig.l, 1), hsla(360, colorConfig.s, colorConfig.l, 1));
  inputRangeStyles['range-s'].backgroundImage = linearGradient(90, hsla(colorConfig.h, 0, colorConfig.l, 1), hsla(colorConfig.h, 100, colorConfig.l, 1));
  inputRangeStyles['range-l'].backgroundImage = linearGradient(90, hsla(colorConfig.h, colorConfig.s, 0, 1), hsla(colorConfig.h, colorConfig.s, 50, 1), hsla(colorConfig.h, colorConfig.s, 100, 1));
  inputRangeStyles['range-a'].background = linearGradient(90, rgba(colorConfig.r, colorConfig.g, colorConfig.b, 0), rgba(colorConfig.r, colorConfig.g, colorConfig.b, 1));
};

// main
var changeValue = function changeValue(key, value) {
  // set
  colorConfig[key.replace(/^\S+-/, '')] = value;
  // update other values
  var inputValues = {
    'text-rgb': colorConfig.rgb,
    'text-rgba': colorConfig.rgba,
    'text-hsl': colorConfig.hsl,
    'text-hsla': colorConfig.hsla,
    'text-hex': colorConfig.hex,
    'num-r': colorConfig.r,
    'num-g': colorConfig.g,
    'num-b': colorConfig.b,
    'num-r16': colorConfig.r16,
    'num-g16': colorConfig.g16,
    'num-b16': colorConfig.b16,
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
    'range-a': colorConfig.a
  };
  delete inputValues[key];
  for (var inputKey in inputValues) {
    if (!inputValues.hasOwnProperty(inputKey)) {
      continue;
    }
    formInput[inputKey].value = inputValues[inputKey];
  }
  // update
  updateView();
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
  updateView();
};

// init
global.addEventListener('load', function () {
  // set global var
  navTabs = Array.from(global.document.getElementById('nav-tab').getElementsByTagName('a'));
  tabs = [Array.from(global.document.getElementsByClassName('rgb')), Array.from(global.document.getElementsByClassName('rgba')), Array.from(global.document.getElementsByClassName('hsl')), Array.from(global.document.getElementsByClassName('hsla')), Array.from(global.document.getElementsByClassName('hex'))];
  formInput = global.document.getElementById('form-input');
  formOutput = global.document.getElementById('form-output');
  layerBgColor = global.document.getElementById('layer-bgcolor');
  inputRangeStyles = {
    'range-r': global.document.getElementById('range-r').style,
    'range-g': global.document.getElementById('range-g').style,
    'range-b': global.document.getElementById('range-b').style,
    'range-h': global.document.getElementById('range-h').style,
    'range-s': global.document.getElementById('range-s').style,
    'range-l': global.document.getElementById('range-l').style,
    'range-a': global.document.getElementById('range-a').style
  };
  // init dom
  for (var i = 0; i < tabList.length; i++) {
    navTabs[i].setAttribute('href', '#' + tabList[i]);
  }
  // add event
  global.document.getElementById('nav-tab').addEventListener('click', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'a') {
      evt.preventDefault();
      evt.target.blur();
      changeTab(evt.target.getAttribute('href').substr(1));
    }
  }, false);
  formInput.addEventListener('change', function (evt) {
    return changeValue(evt.target.id, evt.target.value);
  }, false);
  formInput.addEventListener('input', function (evt) {
    return changeValue(evt.target.id, evt.target.value);
  }, false);
  var formOutputInputs = formOutput.getElementsByTagName('input');
  for (var i = 0; i < formOutputInputs.length; i++) {
    formOutputInputs[i].addEventListener('focus', function (evt) {
      return evt.target.select();
    }, false);
  }
  // set tab
  var locationHash = global.location.hash.substr(1),
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
      colorConfig[key] = config[key];
    }
    changeValue('num-r', colorConfig.r);
    formInput['num-r'].value = colorConfig.r;
  } catch (err) {
    var textRgba = rgba(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1);
    changeValue('text-rgba', textRgba);
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

var PrivateProperties = function PrivateProperties() {
  var wm = new WeakMap();
  //return self => wm.get(self) || wm.set(self, Object.create(null)).get(self);
  // `WeakMap.prototype.set` does not return `this` in IE11
  return function (self) {
    return wm.get(self) || (wm.set(self, Object.create(null)), wm.get(self));
  };
};

var isNumber = function isNumber(n) {
  return !Number.isNaN(n) && Number.isFinite(n);
};

var toHex = function toHex(n) {
  return ('0' + n.toString(16)).slice(-2);
};

var ColorConfig = (function () {
  var privateProperties = new PrivateProperties();

  var sync = function sync(changedColorScheme) {
    switch (changedColorScheme) {
      case 'rgb':
        var _rgb2hsl = _rgb2hsl4['default']([this.r, this.g, this.b]);

        var _rgb2hsl2 = _slicedToArray(_rgb2hsl, 3);

        privateProperties(this).h = _rgb2hsl2[0];
        privateProperties(this).s = _rgb2hsl2[1];
        privateProperties(this).l = _rgb2hsl2[2];

        break;
      case 'hsl':
        var _hsl2rgb = _hsl2rgb4['default']([this.h, this.s, this.l]);

        var _hsl2rgb2 = _slicedToArray(_hsl2rgb, 3);

        privateProperties(this).r = _hsl2rgb2[0];
        privateProperties(this).g = _hsl2rgb2[1];
        privateProperties(this).b = _hsl2rgb2[2];

        break;
    }
  };

  var setNumber = function setNumber(key, value) {
    value = parseFloat(value);
    if (isNumber(value)) {
      privateProperties(this)[key] = value;
      if ('rgb'.includes(key)) {
        sync.call(this, 'rgb');
      } else if ('hsl'.includes(key)) {
        sync.call(this, 'hsl');
      }
    }
    return value;
  };

  var setHex = function setHex(key, value) {
    value = String(value);
    if (value.length === 1) {
      value += value;
    }
    return setNumber.call(this, key, parseInt(value, 16));
  };

  var setString = function setString(key, value) {
    value = value.replace(/[rgbhsla();\s]/g, '').split(',').map(parseFloat);
    for (var i = 0; i < Math.min(key.length, value.length); i++) {
      if (isNumber(value[i])) {
        privateProperties(this)[key[i]] = value[i];
      }
    }
    sync.call(this, key.substr(0, 3));
    return value;
  };

  return (function () {
    var _class = function () {
      _classCallCheck(this, _class);

      privateProperties(this).r = 0;
      privateProperties(this).g = 0;
      privateProperties(this).b = 0;
      privateProperties(this).h = 0;
      privateProperties(this).s = 0;
      privateProperties(this).l = 0;
      privateProperties(this).a = 1;
    };

    _createClass(_class, [{
      key: 'r',
      get: function () {
        return privateProperties(this).r;
      },
      set: function (n) {
        return setNumber.call(this, 'r', n);
      }
    }, {
      key: 'g',
      get: function () {
        return privateProperties(this).g;
      },
      set: function (n) {
        return setNumber.call(this, 'g', n);
      }
    }, {
      key: 'b',
      get: function () {
        return privateProperties(this).b;
      },
      set: function (n) {
        return setNumber.call(this, 'b', n);
      }
    }, {
      key: 'r16',
      get: function () {
        return toHex(this.r);
      },
      set: function (s) {
        return setHex.call(this, 'r', s);
      }
    }, {
      key: 'g16',
      get: function () {
        return toHex(this.g);
      },
      set: function (s) {
        return setHex.call(this, 'g', s);
      }
    }, {
      key: 'b16',
      get: function () {
        return toHex(this.b);
      },
      set: function (s) {
        return setHex.call(this, 'b', s);
      }
    }, {
      key: 'h',
      get: function () {
        return privateProperties(this).h;
      },
      set: function (n) {
        return setNumber.call(this, 'h', n);
      }
    }, {
      key: 's',
      get: function () {
        return privateProperties(this).s;
      },
      set: function (n) {
        return setNumber.call(this, 's', n);
      }
    }, {
      key: 'l',
      get: function () {
        return privateProperties(this).l;
      },
      set: function (n) {
        return setNumber.call(this, 'l', n);
      }
    }, {
      key: 'a',
      get: function () {
        return privateProperties(this).a;
      },
      set: function (n) {
        return setNumber.call(this, 'a', n);
      }
    }, {
      key: 'rgb',
      get: function () {
        return 'rgb(' + Math.round(this.r) + ', ' + Math.round(this.g) + ', ' + Math.round(this.b) + ')';
      },
      set: function (s) {
        return setString.call(this, 'rgb', s);
      }
    }, {
      key: 'rgba',
      get: function () {
        return 'rgba(' + Math.round(this.r) + ', ' + Math.round(this.g) + ', ' + Math.round(this.b) + ', ' + this.a + ')';
      },
      set: function (s) {
        return setString.call(this, 'rgba', s);
      }
    }, {
      key: 'hsl',
      get: function () {
        return 'hsl(' + Math.round(this.h) + ', ' + Math.round(this.s) + '%, ' + Math.round(this.l) + '%)';
      },
      set: function (s) {
        return setString.call(this, 'hsl', s);
      }
    }, {
      key: 'hsla',
      get: function () {
        return 'hsla(' + Math.round(this.h) + ', ' + Math.round(this.s) + '%, ' + Math.round(this.l) + '%, ' + this.a + ')';
      },
      set: function (s) {
        return setString.call(this, 'hsla', s);
      }
    }, {
      key: 'hex',
      get: function () {
        return '#' + this.r16 + this.g16 + this.b16;
      },
      set: function (s) {
        s = s.replace('#', '');
        var length = 2;
        if (s.length === 3) {
          length = 1;
        } else if (s.length !== 6) {
          s = (s + '000000').substr(0, 6);
        }
        setHex.call(this, 'r', s.substr(0, length));
        setHex.call(this, 'g', s.substr(length, length));
        setHex.call(this, 'b', s.substr(length * 2, length));
      }
    }, {
      key: 'toString',
      value: function toString() {
        return JSON.stringify(privateProperties(this));
      }
    }]);

    return _class;
  })();
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
      m = l - c / 2;
  var r = l;
  var g = l;
  var b = l;

  if (s !== 0) {
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
  }
  return [Math.round(255 * r), Math.round(255 * g), Math.round(255 * b)];
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

  var h = 0,
      s = 0,
      l = sum * 50;
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

exports['default'] = rgb2hsl;
module.exports = exports['default'];

},{}]},{},[1]);
