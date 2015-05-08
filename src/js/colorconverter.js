/* global global */
/* jshint esnext: true */
/* jshint browser: true */

'use strict';

import ColorConfig from './colorconfig';
import updateView from './view';
import { rgba, randomInt, arrayFrom } from './util';

if (!Array.from) {
  arrayFrom();
}

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
