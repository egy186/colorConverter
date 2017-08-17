export const tabList = [
  'rgb',
  'rgba',
  'hsl',
  'hsla',
  'hex'
];

// Select tab
let navTabs;
let tabs;
const changeTab = (colorConfig, newTab) => {
  const newTabIndex = tabList.indexOf(newTab);
  if (newTabIndex === -1) {
    return false;
  }
  // Forms
  tabs.forEach(tab => tab.forEach(el => {
    el.style.display = 'none';
  }));
  tabs[newTabIndex].forEach(el => {
    el.style.display = '';
  });
  // Nav-tab
  navTabs.forEach(el => el.parentElement.classList.remove('active'));
  navTabs[newTabIndex].parentElement.classList.add('active');
  return true;
};

export default changeTab;

window.addEventListener('load', () => {
  // Set global var
  navTabs = Array.from(document.getElementById('nav-tab').getElementsByTagName('a'));
  tabs = [
    Array.from(document.getElementsByClassName('rgb')),
    Array.from(document.getElementsByClassName('rgba')),
    Array.from(document.getElementsByClassName('hsl')),
    Array.from(document.getElementsByClassName('hsla')),
    Array.from(document.getElementsByClassName('hex'))
  ];
  // Init dom
  for (let i = 0; i < tabList.length; i++) {
    navTabs[i].setAttribute('href', `#${tabList[i]}`);
  }
}, false);
