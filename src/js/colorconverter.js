/* jshint esnext: true */
/* jshint browser: true */

'use strict';

import ColorConfig from './colorconfig';

let rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;
let hsla = (h, s, l, a) => `hsla(${h}, ${s}%, ${l}%, ${a})`;
let linearGradient = (deg, ...colors) => `linear-gradient(${deg}deg, ${colors.join(', ')})`;

// colorConverter
let colorConfig = new ColorConfig(),
    tabs,
    tabList = ['rgb', 'rgba', 'hsl', 'hsla', 'hex'],
    // select tab
    currentTab = tabList[0],
    navTabs,
    // main
    formInput,
    formOutput,
    layerBgColor,
    inputRangeSts;

let update = () => {
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
let main = (key, value) => {
  // set colorConfig
  if (/^num16/.test(key)) {
    if (value.length === 1) {
      value = String(value) + String(value);
    }
    value = parseInt(value, 16);
  }
  colorConfig.set(key.replace(/^\S+-/, ''), value);
  // set values
  let inputValues = {
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
    'num16-b': ('0' + colorConfig.b.toString(16)).slice(-2),
  };
  delete inputValues[key];
  for (let inputKey in inputValues) {
    formInput[inputKey].value = inputValues[inputKey];
  }
  // form-output
  formOutput['output-rgb'].value = colorConfig.toString('rgb');
  formOutput['output-rgba'].value = colorConfig.toString('rgba');
  formOutput['output-hsl'].value = colorConfig.toString('hsl');
  formOutput['output-hsla'].value = colorConfig.toString('hsla');
  formOutput['output-hex'].value = colorConfig.toString('hex');
  formOutput['output-permalink'].value = global.location.toString() + '#' + currentTab + '&' +JSON.stringify(colorConfig);
  // range
  inputRangeSts[0].backgroundImage = linearGradient(
    90,
    rgba(0, colorConfig.g, colorConfig.b, 1),
    rgba(255, colorConfig.g, colorConfig.b, 1)
  );
  inputRangeSts[1].backgroundImage = linearGradient(
    90,
    rgba(colorConfig.r, 0, colorConfig.b, 1),
    rgba(colorConfig.g, 255, colorConfig.b, 1)
  );
  inputRangeSts[2].backgroundImage = linearGradient(
    90,
    rgba(colorConfig.r, colorConfig.g, 0, 1),
    rgba(colorConfig.r, colorConfig.g, 255, 1)
  );
  inputRangeSts[3].backgroundImage = linearGradient(
    90,
    hsla(0, colorConfig.s, colorConfig.l, 1),
    hsla(60, colorConfig.s, colorConfig.l, 1),
    hsla(120, colorConfig.s, colorConfig.l, 1),
    hsla(180, colorConfig.s, colorConfig.l, 1),
    hsla(240, colorConfig.s, colorConfig.l, 1),
    hsla(300, colorConfig.s, colorConfig.l, 1),
    hsla(360, colorConfig.s, colorConfig.l, 1)
  );
  inputRangeSts[4].backgroundImage = linearGradient(
    90,
    hsla(colorConfig.h, 0, colorConfig.l, 1),
    hsla(colorConfig.h, 100, colorConfig.l, 1)
  );
  inputRangeSts[5].backgroundImage = linearGradient(
    90,
    hsla(colorConfig.h, colorConfig.s, 0, 1),
    hsla(colorConfig.h, colorConfig.s, 50, 1),
    hsla(colorConfig.h, colorConfig.s, 100, 1)
  );
  inputRangeSts[6].background = linearGradient(
    90,
    rgba(colorConfig.r, colorConfig.g, colorConfig.b, 0),
    rgba(colorConfig.r, colorConfig.g, colorConfig.b, 1)
  );
  // set CSS
  update();
};

// select tab
let changeTab = newTab => {
  let newTabIndex = tabList.indexOf(newTab);
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
  update();
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
  inputRangeSts = [
    global.document.getElementById('range-r').style,
    global.document.getElementById('range-g').style,
    global.document.getElementById('range-b').style,
    global.document.getElementById('range-h').style,
    global.document.getElementById('range-s').style,
    global.document.getElementById('range-l').style,
    global.document.getElementById('range-a').style
  ];
  // init dom
  for (let i = 0; i < tabList.length; i++) {
    navTabs[i].setAttribute('href', '#' + tabList[i]);
  }
  // add event
  global.document.getElementById('nav-tab').addEventListener('click', evt => {
    if (evt.target.tagName.toLowerCase() === 'a') {
      evt.preventDefault();
      evt.target.blur();
      changeTab(evt.target.getAttribute('href').slice(1));
    }
  }, false);
  formInput.addEventListener('change', evt => main(evt.target.id, evt.target.value), false);
  formInput.addEventListener('input', evt => main(evt.target.id, evt.target.value), false);
  let formOutputInputs = formOutput.getElementsByTagName('input');
  for (let i = 0; i < formOutputInputs.length; i++) {
    formOutputInputs[i].addEventListener('focus', evt => evt.target.select(), false);
  }
  // set tab
  let locationHash = global.location.hash.slice(1),
      scheme = locationHash.replace(/&\S*$/, '').toLowerCase();
  if (tabList.indexOf(scheme) !== -1) {
    changeTab(scheme);
  } else {
    changeTab(tabList[Math.floor(Math.random() * 5)]);
  }
  // set color
  try {
    let config = JSON.parse(locationHash.replace(/^\S*&/, ''));
    for (let key in config) {
      colorConfig.set(key, config[key]);
    }
    main('num-r', colorConfig.r);
    formInput['num-r'].value = colorConfig.r;
  } catch (err) {
    let textRgba = rgba(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1);
    main('text-rgba', textRgba);
    formInput['text-rgba'].value = textRgba;
  }
  history.replaceState({}, '', location.href.replace(/\#.*/, ''));
}, false);
