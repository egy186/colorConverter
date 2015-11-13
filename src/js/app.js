/* global global: false */

import ColorConfig from './colorconfig';
import tab from './tab';
import { tabList } from './tab';
import view from './view';
import { rgba, randomInt } from './util';
// import polyfill
import './polyfill/arrayfrom';

const colorConfig = new ColorConfig();
let currentTab = tabList[0];

const updateView = () => view(colorConfig, currentTab);
const changeTab = newTab => {
  currentTab = newTab;
  updateView();
  return tab(colorConfig, currentTab);
};

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
  inputKeys.forEach(inputKey => {
    formInput[inputKey].value = colorConfig[inputKey.replace(pattern, '')];
  });
  // update
  updateView();
};

// init
global.addEventListener('load', () => {
  // set global var
  formInput = global.document.getElementById('form-input');
  // add event
  formInput.addEventListener('change', evt => changeValue(evt.target.id, evt.target.value), false);
  formInput.addEventListener('input', evt => changeValue(evt.target.id, evt.target.value), false);
  global.document.getElementById('nav-tab').addEventListener('click', evt => {
    if (evt.target.tagName.toLowerCase() === 'a') {
      evt.preventDefault();
      evt.target.blur();
      changeTab(evt.target.getAttribute('href').substr(1));
    }
  }, false);
  // init
  const locationHash = global.location.hash.substr(1);
  // init tab
  let scheme = locationHash.replace(/&\S*$/, '').toLowerCase();
  if (tabList.indexOf(scheme) === -1) {
    scheme = tabList[randomInt(0, 4)];
  }
  changeTab(scheme);
  // init color
  try {
    const config = JSON.parse(locationHash.replace(/^\S*&/, ''));
    for (const key in config) {
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
  // url
  global.history.replaceState({}, '', global.location.href.replace(/\#.*/, ''));
}, false);
