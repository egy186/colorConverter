import 'core-js/fn/array/from'; // eslint-disable-line
import { randomInt, rgba } from './util';
import tab, { tabList } from './tab';
import Color from 'color';
import view from './view';

const color = new Color();
let currentTab = tabList[0];

const updateView = () => view(color, currentTab);
const changeTab = newTab => {
  currentTab = newTab;
  updateView();
  return tab(color, currentTab);
};

// Main
let formInput;
const changeValue = (key, value) => {
  const pattern = new RegExp('^\\S+-');
  // Set
  color[key.replace(pattern, '')] = value;
  // Update other values
  const inputKeys = [
    'text-rgb', 'text-rgba', 'text-hsl', 'text-hsla', 'text-hex',
    'num-r', 'num-g', 'num-b', 'num-r16', 'num-g16', 'num-b16', 'num-h', 'num-s', 'num-l', 'num-a',
    'range-r', 'range-g', 'range-b', 'range-h', 'range-s', 'range-l', 'range-a'
  ];
  inputKeys.splice(inputKeys.indexOf(key), 1);
  inputKeys.forEach(inputKey => {
    formInput[inputKey].value = color[inputKey.replace(pattern, '')];
  });
  // Update
  updateView();
};

// Init
window.addEventListener('load', () => {
  // Set global var
  formInput = document.getElementById('form-input');
  // Add event
  formInput.addEventListener('change', evt => changeValue(evt.target.id, evt.target.value), false);
  formInput.addEventListener('input', evt => changeValue(evt.target.id, evt.target.value), false);
  document.getElementById('nav-tab').addEventListener('click', evt => {
    if (evt.target.tagName.toLowerCase() === 'a') {
      evt.preventDefault();
      evt.target.blur();
      changeTab(evt.target.getAttribute('href').substr(1));
    }
  }, false);
  // Init
  const locationHash = location.hash.substr(1);
  // Init tab
  let scheme = locationHash.replace(/&\S*$/, '').toLowerCase();
  if (tabList.indexOf(scheme) === -1) {
    scheme = tabList[randomInt(0, 4)];
  }
  changeTab(scheme);
  // Init color
  try {
    const config = JSON.parse(unescape(locationHash.replace(/^\S*&/, '')));
    Object.keys(config).forEach(key => {
      color[key] = config[key];
    });
    changeValue('num-r', color.r);
    formInput['num-r'].value = color.r;
  } catch (err) { // eslint-disable-line no-unused-vars
    const textRgba = rgba(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255), 1);
    changeValue('text-rgba', textRgba);
    formInput['text-rgba'].value = textRgba;
  }
  // Url
  history.replaceState({}, '', location.href.replace(/#.*/, ''));
}, false);
