export const tabList = ['rgb', 'rgba', 'hsl', 'hsla', 'hex'];

// select tab
let navTabs;
let tabs;
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

window.addEventListener('load', () => {
  // set global var
  navTabs = Array.from(document.getElementById('nav-tab').getElementsByTagName('a'));
  tabs = [
    Array.from(document.getElementsByClassName('rgb')),
    Array.from(document.getElementsByClassName('rgba')),
    Array.from(document.getElementsByClassName('hsl')),
    Array.from(document.getElementsByClassName('hsla')),
    Array.from(document.getElementsByClassName('hex'))
  ];
  // init dom
  for (let i = 0; i < tabList.length; i++) {
    navTabs[i].setAttribute('href', '#' + tabList[i]);
  }
}, false);
