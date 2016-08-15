import 'core-js/fn/array/from';
import { hsla, linearGradient, rgba } from './util';

let formOutput;
let inputRangeStyles;
let layerBgColor;

const updateView = (colorConfig, currentTab) => {
  // form-output
  formOutput['output-rgb'].value = colorConfig.rgb;
  formOutput['output-rgba'].value = colorConfig.rgba;
  formOutput['output-hsl'].value = colorConfig.hsl;
  formOutput['output-hsla'].value = colorConfig.hsla;
  formOutput['output-hex'].value = colorConfig.hex;
  formOutput['output-permalink'].value = `${location.toString()}#${currentTab}&${colorConfig.toString()}`;
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
  return true;
};

window.addEventListener('load', () => {
  formOutput = document.getElementById('form-output');
  layerBgColor = document.getElementById('layer-bgcolor');
  inputRangeStyles = {
    'range-a': document.getElementById('range-a').style,
    'range-b': document.getElementById('range-b').style,
    'range-g': document.getElementById('range-g').style,
    'range-h': document.getElementById('range-h').style,
    'range-l': document.getElementById('range-l').style,
    'range-r': document.getElementById('range-r').style,
    'range-s': document.getElementById('range-s').style
  };
  // onFocus
  const handler = evt => evt.target.select();
  Array.from(formOutput.getElementsByTagName('input')).forEach(el => el.addEventListener('focus', handler, false));
}, false);

export default updateView;
