/* global global: false */

export const tabList = ['rgb', 'rgba', 'hsl', 'hsla', 'hex'];

// select tab
let tabs, navTabs;
const changeTab = (colorConfig, newTab) => {
  const newTabIndex = tabList.indexOf(newTab);
  if (newTabIndex === -1) {
    return false;
  }
  // forms
  tabs.forEach(tab => tab.forEach(el => el.style.display = 'none'));
  tabs[newTabIndex].forEach(el => el.style.display = '');
  // nav-tab
  navTabs.forEach(el => el.parentElement.classList.remove('active'));
  navTabs[newTabIndex].parentElement.classList.add('active');
  return true;
};

export default changeTab;

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
  // init dom
  for (let i = 0; i < tabList.length; i++) {
    navTabs[i].setAttribute('href', '#' + tabList[i]);
  }
}, false);
