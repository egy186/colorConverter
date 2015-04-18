/* jshint esnext: true */
/* jshint browser: true */

'use strict';

import ColorConfig from './colorconfig';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
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
      // 17. Repeat, while k < len... (also steps a - h)
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
  }());
}

const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;
const hsla = (h, s, l, a) => `hsla(${h}, ${s}%, ${l}%, ${a})`;
const linearGradient = (deg, ...colors) => `linear-gradient(${deg}deg, ${colors.join(', ')})`;

const colorConfig = new ColorConfig(),
      tabList = ['rgb', 'rgba', 'hsl', 'hsla', 'hex'];
let tabs,
    // select tab
    currentTab = tabList[0],
    navTabs,
    // main
    formInput,
    formOutput,
    layerBgColor,
    inputRangeStyles;

const updateView = () => {
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
  inputRangeStyles['range-r'].backgroundImage = linearGradient(
    90,
    rgba(0, colorConfig.g, colorConfig.b, 1),
    rgba(255, colorConfig.g, colorConfig.b, 1)
  );
  inputRangeStyles['range-g'].backgroundImage = linearGradient(
    90,
    rgba(colorConfig.r, 0, colorConfig.b, 1),
    rgba(colorConfig.r, 255, colorConfig.b, 1)
  );
  inputRangeStyles['range-b'].backgroundImage = linearGradient(
    90,
    rgba(colorConfig.r, colorConfig.g, 0, 1),
    rgba(colorConfig.r, colorConfig.g, 255, 1)
  );
  inputRangeStyles['range-h'].backgroundImage = linearGradient(
    90,
    hsla(0, colorConfig.s, colorConfig.l, 1),
    hsla(60, colorConfig.s, colorConfig.l, 1),
    hsla(120, colorConfig.s, colorConfig.l, 1),
    hsla(180, colorConfig.s, colorConfig.l, 1),
    hsla(240, colorConfig.s, colorConfig.l, 1),
    hsla(300, colorConfig.s, colorConfig.l, 1),
    hsla(360, colorConfig.s, colorConfig.l, 1)
  );
  inputRangeStyles['range-s'].backgroundImage = linearGradient(
    90,
    hsla(colorConfig.h, 0, colorConfig.l, 1),
    hsla(colorConfig.h, 100, colorConfig.l, 1)
  );
  inputRangeStyles['range-l'].backgroundImage = linearGradient(
    90,
    hsla(colorConfig.h, colorConfig.s, 0, 1),
    hsla(colorConfig.h, colorConfig.s, 50, 1),
    hsla(colorConfig.h, colorConfig.s, 100, 1)
  );
  inputRangeStyles['range-a'].background = linearGradient(
    90,
    rgba(colorConfig.r, colorConfig.g, colorConfig.b, 0),
    rgba(colorConfig.r, colorConfig.g, colorConfig.b, 1)
  );
};

// main
const changeValue = (key, value) => {
  // set
  colorConfig[key.replace(/^\S+-/, '')] = value;
  // update other values
  const inputValues = {
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
  for (let inputKey in inputValues) {
    if (!inputValues.hasOwnProperty(inputKey)) {
      continue;
    }
    formInput[inputKey].value = inputValues[inputKey];
  }
  // update
  updateView();
};

// select tab
const changeTab = newTab => {
  const newTabIndex = tabList.indexOf(newTab);
  if (newTabIndex === -1) {
    return;
  }
  // forms
  tabs.forEach(el => el.forEach(el => el.style.display = 'none'));
  tabs[newTabIndex].forEach(el => el.style.display = '');
  // nav-tab
  navTabs[tabList.indexOf(currentTab)].parentElement.classList.remove('active');
  navTabs[newTabIndex].parentElement.classList.add('active');
  // set new tab
  currentTab = newTab;
  // update
  updateView();
};

// init
global.addEventListener('load', () => {
  // set global var
  navTabs = Array.from(global.document.getElementById('nav-tab').getElementsByTagName('a'));
  tabs = [
    Array.from(global.document.getElementsByClassName('rgb')),
    Array.from(global.document.getElementsByClassName('rgba')),
    Array.from(global.document.getElementsByClassName('hsl')),
    Array.from(global.document.getElementsByClassName('hsla')),
    Array.from(global.document.getElementsByClassName('hex'))
  ];
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
  for (let i = 0; i < tabList.length; i++) {
    navTabs[i].setAttribute('href', '#' + tabList[i]);
  }
  // add event
  global.document.getElementById('nav-tab').addEventListener('click', evt => {
    if (evt.target.tagName.toLowerCase() === 'a') {
      evt.preventDefault();
      evt.target.blur();
      changeTab(evt.target.getAttribute('href').substr(1));
    }
  }, false);
  formInput.addEventListener('change', evt => changeValue(evt.target.id, evt.target.value), false);
  formInput.addEventListener('input', evt => changeValue(evt.target.id, evt.target.value), false);
  const formOutputInputs = formOutput.getElementsByTagName('input');
  for (let i = 0; i < formOutputInputs.length; i++) {
    formOutputInputs[i].addEventListener('focus', evt => evt.target.select(), false);
  }
  // set tab
  const locationHash = global.location.hash.substr(1),
        scheme = locationHash.replace(/&\S*$/, '').toLowerCase();
  if (tabList.indexOf(scheme) !== -1) {
    changeTab(scheme);
  } else {
    changeTab(tabList[Math.floor(Math.random() * 5)]);
  }
  // set color
  try {
    const config = JSON.parse(locationHash.replace(/^\S*&/, ''));
    for (let key in config) {
      if (!config.hasOwnProperty(key)) {
        continue;
      }
      colorConfig[key] = config[key];
    }
    changeValue('num-r', colorConfig.r);
    formInput['num-r'].value = colorConfig.r;
  } catch (err) {
    const textRgba = rgba(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1);
    changeValue('text-rgba', textRgba);
    formInput['text-rgba'].value = textRgba;
  }
  history.replaceState({}, '', location.href.replace(/\#.*/, ''));
}, false);
