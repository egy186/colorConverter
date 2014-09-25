// egy.ColorConfig
if (typeof egy !== 'object') {
  egy = {};
}
egy.ColorConfig = function () { };
egy.ColorConfig.prototype = {
  r: 0,
  g: 0,
  b: 0,
  h: 0,
  s: 0,
  l: 0,
  a: 1,
  set: function (key, value) {
    switch (key) {
      case 'r':
      case 'g':
      case 'b':
      case 'a': // a exactly doesn't need sync
        value = parseFloat(value);
        if (!isNaN(value)) {
          this[key] = value;
        }
        this.sync('rgb');
        break;
      case 'h':
      case 's':
      case 'l':
        value = parseFloat(value);
        if (!isNaN(value)) {
          this[key] = value;
        }
        this.sync('hsl');
        break;
      case 'rgb':
      case 'rgba':
        value = value.replace(/[rgba();\s]/g, '').split(/,/);
        for (var i = 0; i < value.length; i++) {
          value[i] = parseFloat(value[i]);
        }
        switch (value.length) {
          case 4:
            if (!isNaN(value[3])) {
              this.a = value[3];
            }
          case 3:
            if (!isNaN(value[2])) {
              this.b = value[2];
            }
          case 2:
            if (!isNaN(value[1])) {
              this.g = value[1];
            }
          case 1:
            if (!isNaN(value[0])) {
              this.r = value[0];
            }
          case 0:
            break;
        }
        this.sync('rgb');
        break;
      case 'hsl':
      case 'hsla':
        value = value.replace(/[hsla();\s]/g, '').split(/,/);
        for (var i = 0; i < value.length; i++) {
          value[i] = parseFloat(value[i]);
        }
        switch (value.length) {
          case 4:
            if (!isNaN(value[3])) {
              this.a = value[3];
            }
          case 3:
            if (!isNaN(value[2])) {
              this.l = value[2];
            }
          case 2:
            if (!isNaN(value[1])) {
              this.s = value[1];
            }
          case 1:
            if (!isNaN(value[0])) {
              this.h = value[0];
            }
          case 0:
            break;
        }
        this.sync('hsl');
        break;
      case 'hex':
        value = value.replace('#', '');
        if (value.length === 3) {
          var r = parseInt(value.substr(0, 1), 16),
          g = parseInt(value.substr(1, 1), 16),
          b = parseInt(value.substr(2, 1), 16);
          this.r = r + r * 16;
          this.g = g + g * 16;
          this.b = b + b * 16;
        } else {
          if (value.length !== 6) {
            value = ('000000' + value).slice(-6);
          }
          this.r = parseInt(value.substr(0, 2), 16);
          this.g = parseInt(value.substr(2, 2), 16);
          this.b = parseInt(value.substr(4, 2), 16);
        }
        this.sync('rgb');
        break;
      default:
        return false;
    }
    return true;
  },
  sync: function (changedColorScheme) {
    switch (changedColorScheme) {
      case 'rgb':
        // rgb2hsl
        var R = this.r / 255,
        G = this.g / 255,
        B = this.b / 255,
        max = Math.max(R, G, B),
        min = Math.min(R, G, B),
        sum = max + min,
        delta = max - min,
        H,
        S,
        L = sum * 50;
        if (delta === 0) {
          H = S = 0;
        } else {
          switch (max) {
            case R:
              H = 60 * (G - B) / delta;
              break;
            case G:
              H = 120 + 60 * (B - R) / delta;
              break;
            case B:
              H = 240 + 60 * (R - G) / delta;
              break;
          }
          if (L < 50) {
            S = delta * 100 / sum;
          } else {
            S = delta * 100 / (2 - sum);
          }
          if (H < 0) {
            H += 360;
          }
        }
        // return
        this.h = Math.round(H);
        this.s = Math.round(S);
        this.l = Math.round(L);
        break;
      case 'hsl':
        // hsl2rgb
        var H = this.h,
        S = this.s / 100,
        L = this.l / 100,
        R,
        G,
        B;
        if (S === 0) {
          R = G = B = L;
        } else {
          var C = S * (1 - Math.abs(2 * L - 1)),
          X = C * (1 - Math.abs((H / 60) % 2 - 1)),
          m = L - C / 2;
          while (H < 0) {
            H += 360;
          }
          while (H > 360) {
            H -= 360;
          }
          if (H < 60) {
            R = C + m;
            G = X + m;
            B = m;
          } else if (H < 120) {
            R = X + m;
            G = C + m;
            B = m;
          } else if (H < 180) {
            R = m;
            G = C + m;
            B = X + m;
          } else if (H < 240) {
            R = m;
            G = X + m;
            B = C + m;
          } else if (H < 300) {
            R = X + m;
            G = m;
            B = C + m;
          } else {
            R = C + m;
            G = m;
            B = X + m;
          }
        }
        // return
        this.r = Math.round(255 * R);
        this.g = Math.round(255 * G);
        this.b = Math.round(255 * B);
        break;
      default:
        return false;
    }
    return true;
  },
  toString: function (colorScheme) {
    if (!colorScheme) {
      return JSON.stringify(this);
    }
    switch (colorScheme.toLowerCase()) {
      case 'rgb':
        return 'rgb(' + Math.round(this.r) + ', ' + Math.round(this.g) + ', ' + Math.round(this.b) + ')';
      case 'rgba':
        return 'rgba(' + Math.round(this.r) + ', ' + Math.round(this.g) + ', ' + Math.round(this.b) + ', ' + this.a + ')';
      case 'hsl':
        return 'hsl(' + Math.round(this.h) + ', ' + Math.round(this.s) + '%, ' + Math.round(this.l) + '%)';
      case 'hsla':
        return 'hsla(' + Math.round(this.h) + ', ' + Math.round(this.s) + '%, ' + Math.round(this.l) + '%, ' + this.a + ')';
      case 'hex':
        return '#' + ('000000' + (this.r * 65536 + this.g * 256 + this.b).toString(16)).slice(-6);
    }
  }
};

// colorConverter
var colorConfig = new egy.ColorConfig(),
    tabList = ['RGB', 'RGBa', 'HSL', 'HSLa', 'Hex'],
    // select tab
    currentTab = 'RGB',
    navTabs,
    // main
    formInput,
    formOutput,
    layerBgColor,
    inputRangeSts;

// init
addEventListener('load', function init() {
  var i;
  // set global var
  navTabs = document.getElementById('nav-tab').getElementsByTagName('a');
  formInput = document.getElementById('form-input');
  formOutput = document.getElementById('form-output');
  layerBgColor = document.getElementById('layer-bgcolor');
  inputRangeSts = [
      document.getElementById('range-r').style,
      document.getElementById('range-g').style,
      document.getElementById('range-b').style,
      document.getElementById('range-h').style,
      document.getElementById('range-s').style,
      document.getElementById('range-l').style,
      document.getElementById('range-a').style
  ];
  // init dom
  for (i = 0; i < 5; i++) {
    navTabs[i].setAttribute('href', '#' + tabList[i]);
  }
  // add event
  document.getElementById('nav-tab').addEventListener('click', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'a') {
      evt.preventDefault();
      evt.target.blur();
      changeTab(evt.target.getAttribute('href').slice(1));
    }
  }, false);
  formInput.addEventListener('change', function (evt) {
    main(evt.target.id, evt.target.value);
  }, false);
  formInput.addEventListener('input', function (evt) {
    main(evt.target.id, evt.target.value);
  }, false);
  var formOutputInputs = formOutput.getElementsByTagName('input');
  for (i = 0; i < formOutputInputs.length; i++) {
    formOutputInputs.item(i).addEventListener('focus', function (evt) {
      evt.target.select();
    }, false);
  }
  // set tab
  var locHash = location.hash.slice(1),
      locHashSc = locHash.replace(/&.*$/, '');
  if (tabList.indexOf(locHashSc) !== -1) {
    changeTab(locHashSc);
  } else {
    // random
    changeTab(tabList[Math.floor(Math.random() * 5)]);
    console.log('random tab');
  }
  // set color
  try {
    var config = JSON.parse(locHash.replace(/^.*&/, ''));
    for (var key in config) {
      colorConfig.set(key, config[key]);
    }
    main('num-r', colorConfig.r);
    formInput['num-r'].value = colorConfig.r;
  } catch (err) {
    main('text-rgba', 'rgba(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',1)');
    console.log('random color');
  }
  history.replaceState({}, '', location.href.replace(/\#.*/, ''));
}, false);

// select tab
function changeTab(newTab) {
  var newTabIndex = tabList.indexOf(newTab),
      i, j;
  // newTab is 'RGB', 'RGBa', 'HSL', 'HSLa', 'Hex'
  if (newTabIndex === -1) {
    newTab = 'RGB';
    newTabIndex = 0;
    console.log('unknown tab-name');
  }
  // forms
  var temp;
  for (i = 0; i < tabList.length; i++) {
    temp = document.getElementsByClassName(tabList[i].toLowerCase());
    for (j = 0; j < temp.length; j++) {
      temp[j].style.display = 'none';
    }
  }
  temp = document.getElementsByClassName(newTab.toLowerCase());
  for (i = 0; i < temp.length; i++) {
    temp[i].style.display = '';
  }
  // nav-tab
  navTabs.item(tabList.indexOf(currentTab)).parentElement.classList.remove('active');
  navTabs.item(newTabIndex).parentElement.classList.add('active');
  // return
  currentTab = newTab;
  //history.pushState({ code: clicked }, clicked, '#' + clicked);
  main('num-r', colorConfig.r); // !finally
}

// main
function main(key, value) {
  // set colorConfig
  // TODO: use function
  switch (key) {
    case 'num16-r':
      if (value.length === 1) {
        value = String(value) + String(value);
      }
      value = parseInt(value, 16);
    case 'num-r':
    case 'range-r':
      colorConfig.set('r', value);
      break;
    case 'num16-g':
      if (value.length === 1) {
        value = String(value) + String(value);
      }
      value = parseInt(value, 16);
    case 'num-g':
    case 'range-g':
      colorConfig.set('g', value);
      break;
    case 'num16-b':
      if (value.length === 1) {
        value = String(value) + String(value);
      }
      value = parseInt(value, 16);
    case 'num-b':
    case 'range-b':
      colorConfig.set('b', value);
      break;
    case 'num-h':
    case 'range-h':
      colorConfig.set('h', value);
      break;
    case 'num-s':
    case 'range-s':
      colorConfig.set('s', value);
      break;
    case 'num-l':
    case 'range-l':
      colorConfig.set('l', value);
      break;
    case 'num-a':
    case 'range-a':
      colorConfig.set('a', value);
      break;
    case 'text-rgb':
      colorConfig.set('rgb', value);
      break;
    case 'text-rgba':
      colorConfig.set('rgba', value);
      break;
    case 'text-hsl':
      colorConfig.set('hsl', value);
      break;
    case 'text-hsla':
      colorConfig.set('hsla', value);
      break;
    case 'text-hex':
      colorConfig.set('hex', value);
      break;
    default:
      console.log('unknown key');
      break;
  }
  // set values
  // TODO: use function
  if (key !== 'text-rgb') {
    formInput['text-rgb'].value = colorConfig.toString('rgb');
  }
  if (key !== 'text-rgba') {
    formInput['text-rgba'].value = colorConfig.toString('rgba');
  }
  if (key !== 'text-hsl') {
    formInput['text-hsl'].value = colorConfig.toString('hsl');
  }
  if (key !== 'text-hsla') {
    formInput['text-hsla'].value = colorConfig.toString('hsla');
  }
  if (key !== 'text-hex') {
    formInput['text-hex'].value = colorConfig.toString('hex');
  }
  if (key !== 'num-r') {
    formInput['num-r'].value = colorConfig.r;
  }
  if (key !== 'range-r') {
    formInput['range-r'].value = colorConfig.r;
  }
  if (key !== 'num-g') {
    formInput['num-g'].value = colorConfig.g;
  }
  if (key !== 'range-g') {
    formInput['range-g'].value = colorConfig.g;
  }
  if (key !== 'num-b') {
    formInput['num-b'].value = colorConfig.b;
  }
  if (key !== 'range-b') {
    formInput['range-b'].value = colorConfig.b;
  }
  if (key !== 'num16-r') {
    formInput['num16-r'].value = ('0' + colorConfig.r.toString(16)).slice(-2);
  }
  if (key !== 'num16-g') {
    formInput['num16-g'].value = ('0' + colorConfig.g.toString(16)).slice(-2);
  }
  if (key !== 'num16-b') {
    formInput['num16-b'].value = ('0' + colorConfig.b.toString(16)).slice(-2);
  }
  if (key !== 'num-h') {
    formInput['num-h'].value = colorConfig.h;
  }
  if (key !== 'range-h') {
    formInput['range-h'].value = colorConfig.h;
  }
  if (key !== 'num-s') {
    formInput['num-s'].value = colorConfig.s;
  }
  if (key !== 'range-s') {
    formInput['range-s'].value = colorConfig.s;
  }
  if (key !== 'num-l') {
    formInput['num-l'].value = colorConfig.l;
  }
  if (key !== 'range-l') {
    formInput['range-l'].value = colorConfig.l;
  }
  if (key !== 'num-a') {
    formInput['num-a'].value = colorConfig.a;
  }
  if (key !== 'range-a') {
    formInput['range-a'].value = colorConfig.a;
  }
  // form-output
  formOutput['output-rgb'].value = colorConfig.toString('rgb');
  formOutput['output-rgba'].value = colorConfig.toString('rgba');
  formOutput['output-hsl'].value = colorConfig.toString('hsl');
  formOutput['output-hsla'].value = colorConfig.toString('hsla');
  formOutput['output-hex'].value = colorConfig.toString('hex');
  formOutput['output-permalink'].value = location.toString() + '#' + currentTab + '&' + JSON.stringify(colorConfig);
  // set CSS
  if (currentTab === 'RGBa' || currentTab === 'HSLa') {
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
  inputRangeSts[0].backgroundImage = 'linear-gradient(90deg, rgba(0, ' + colorConfig.g + ', ' + colorConfig.b + ', 1), rgba(255, ' + colorConfig.g + ', ' + colorConfig.b + ', 1))';
  inputRangeSts[1].backgroundImage = 'linear-gradient(90deg, rgba(' + colorConfig.r + ', 0, ' + colorConfig.b + ', 1), rgba(' + colorConfig.r + ', 255, ' + colorConfig.b + ', 1))';
  inputRangeSts[2].backgroundImage = 'linear-gradient(90deg, rgba(' + colorConfig.r + ', ' + colorConfig.g + ', 0, 1), rgba(' + colorConfig.r + ', ' + colorConfig.g + ', 255, 1))';
  inputRangeSts[3].backgroundImage = 'linear-gradient(90deg, hsla(0, ' + colorConfig.s + '%, ' + colorConfig.l + '%, 1), hsla(60, ' + colorConfig.s + '%, ' + colorConfig.l + '%, 1), hsla(120, ' + colorConfig.s + '%, ' + colorConfig.l + '%, 1), hsla(180, ' + colorConfig.s + '%, ' + colorConfig.l + '%, 1), hsla(240, ' + colorConfig.s + '%, ' + colorConfig.l + '%, 1), hsla(300, ' + colorConfig.s + '%, ' + colorConfig.l + '%, 1), hsla(360, ' + colorConfig.s + '%, ' + colorConfig.l + '%, 1))';
  inputRangeSts[4].backgroundImage = 'linear-gradient(90deg, hsla(' + colorConfig.h + ', 0%, ' + colorConfig.l + '%, 1), hsla(' + colorConfig.h + ', 100%, ' + colorConfig.l + '%, 1))';
  inputRangeSts[5].backgroundImage = 'linear-gradient(90deg, hsla(' + colorConfig.h + ', ' + colorConfig.s + '%, 0%, 1), hsla(' + colorConfig.h + ', ' + colorConfig.s + '%, 50%, 1), hsla(' + colorConfig.h + ', ' + colorConfig.s + '%, 100%, 1))';
  inputRangeSts[6].background = 'linear-gradient(90deg, rgba(' + colorConfig.r + ', ' + colorConfig.g + ', ' + colorConfig.b + ', 0), rgba(' + colorConfig.r + ', ' + colorConfig.g + ', ' + colorConfig.b + ', 1))';
}
