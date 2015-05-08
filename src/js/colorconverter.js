/* global global */
/* jshint esnext: true */
/* jshint browser: true */

'use strict';

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

import ColorConfig from './colorconfig';
import updateView from './view';
import { rgba, randomInt } from './util';

const colorConfig = new ColorConfig(),
      tabList = ['rgb', 'rgba', 'hsl', 'hsla', 'hex'];
let currentTab = tabList[0];

// main
let formInput;
const changeValue = (key, value) => {
  const pattern = new RegExp('^\\S+-');
  // set
  colorConfig[key.replace(pattern, '')] = value;
  // update other values
  const inputKeys = [
    'text-rgb', 'text-rgba', 'text-hsl', 'text-hsla', 'text-hex',
    'num-r', 'num-g', 'num-b', 'num-r16', 'num-g16', 'num-b16', 'num-h', 'num-s', 'num-l', 'num-a',
    'range-r', 'range-g', 'range-b', 'range-h', 'range-s', 'range-l', 'range-a'
  ];
  inputKeys.splice(inputKeys.indexOf(key), 1);
  inputKeys.forEach((key) => {
    formInput[key].value = colorConfig[key.replace(pattern, '')];
  });
  // update
  updateView(colorConfig, currentTab);
};

// select tab
let tabs, navTabs;
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
  updateView(colorConfig, currentTab);
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
  // set tab
  const locationHash = global.location.hash.substr(1);
  let scheme = locationHash.replace(/&\S*$/, '').toLowerCase();
  if (tabList.indexOf(scheme) === -1) {
    scheme = tabList[randomInt(0, 4)];
  }
  changeTab(scheme);
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
    const textRgba = rgba(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255), 1);
    changeValue('text-rgba', textRgba);
    formInput['text-rgba'].value = textRgba;
  }
  history.replaceState({}, '', location.href.replace(/\#.*/, ''));
}, false);
