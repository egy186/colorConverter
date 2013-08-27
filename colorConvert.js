/*!
 * colorConvert.js v0.0.3
 * github.com/egy186/colorConverter
 *
 * Copyright (c) 2013 egy186
 * Released under the MIT License.
 */

// select tab
var tab = {
    RGB: document.getElementById('RGB'),
    RGBa: document.getElementById('RGBa'),
    HSL: document.getElementById('HSL'),
    HSLa: document.getElementById('HSLa'),
    Hex: document.getElementById('Hex')
};
var tabKeys = Object.keys(tab),
    tabNav = document.getElementById('codeNav').getElementsByTagName('a'),
    currentTab = 'RGB';
window.addEventListener('load', function () {
    for (var i = 0; i < tabKeys.length; i++) {
        //if (tab[tabKeys[i]]) {
        tab[tabKeys[i]].style.display = 'none';
        //}
    }
    if (location.hash) {
        var hash = location.hash.slice(1);
    } else {
        var hash = 'RGB';
    }
    changeTab(hash);
    history.replaceState({ code: hash }, hash, null);
}, false);
document.getElementById('codeNav').addEventListener('click', function (evt) {
    if (evt.target.tagName.toLowerCase() == 'a') {
        evt.target.blur();
        evt.preventDefault();
        var clicked = evt.target.getAttribute('href').slice(1);
        if (clicked != currentTab) {
            history.pushState({ code: clicked }, clicked, '#' + clicked);
        }
        changeTab(clicked);
    }
}, false);
window.addEventListener('popstate', function (evt) {
    //if (evt.state.code != null) {
    var clicked = evt.state.code;
    /*} else if (location.hash) {
    var clicked = location.hash.slice(1);
    } else {
    var clicked = 'RGB';
    }*/
    changeTab(clicked);
}, false);
function changeTab(newTab) {
    var index = tabKeys.indexOf(newTab);
    if (index == -1) {
        newTab = 'RGB';
        index = 0;
    }
    tab[currentTab].style.display = 'none';
    tabNav.item(tabKeys.indexOf(currentTab)).removeAttribute('class');
    tab[newTab].style.display = 'block';
    tabNav.item(index).setAttribute('class', 'current');
    //result
    setResult.hideOther(newTab);
    currentTab = newTab;
}

// set first color
window.addEventListener('load', function () {
    var rundColor,
        query = queryParam.get();
    if (query) {
        if (query.r >= 0 && query.r <= 255 && query.g >= 0 && query.g <= 255 && query.b >= 0 && query.b <= 255) {
            rundColor = 'rgb(' + query.r + ', ' + query.g + ', ' + query.b + ')';
        }
    } else {
        rundColor = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
    }
    document.getElementById('RGBform').RGB.value = rundColor;
    fromRGB('RGB', rundColor);
}, false);

// setResult
var setResultInputs = document.getElementById('results').getElementsByTagName('input');
for (var i = 0; i < setResultInputs.length; i++) {
    setResultInputs.item(i).addEventListener('focus', function () {
        this.select();
    }, false);
}
function setResult(changedValueName, newValue) {
    var formLoc = document.getElementById('results'),
        RGBArr = [], HSLArr = [], alpha = 1,
        i;
    switch (changedValueName) {
        case 'RGBa':
            alpha = newValue[3];
        case 'RGB':
            for (i = 0; i < 3; i++) {
                RGBArr[i] = newValue[i];
            }
            HSLArr = rgb2hsl(RGBArr[0], RGBArr[1], RGBArr[2]);
            break;
        case 'HSLa':
            alpha = newValue[3];
        case 'HSL':
            for (i = 0; i < 3; i++) {
                HSLArr[i] = newValue[i];
            }
            RGBArr = hsl2rgb(HSLArr[0], HSLArr[1], HSLArr[2]);
            break;
        case 'Hex':
            RGBArr = hex2rgb(newValue);
            HSLArr = rgb2hsl(RGBArr[0], RGBArr[1], RGBArr[2]);
            break;
        default:
            // unsupported
            return;
    }
    formLoc.RGB.value = 'rgb(' + RGBArr[0] + ', ' + RGBArr[1] + ', ' + RGBArr[2] + ')';
    formLoc.RGBa.value = 'rgba(' + RGBArr[0] + ', ' + RGBArr[1] + ', ' + RGBArr[2] + ', ' + alpha + ')';
    formLoc.HSL.value = 'hsl(' + HSLArr[0] + ', ' + HSLArr[1] + ', ' + HSLArr[2] + ')';
    formLoc.HSLa.value = 'hsla(' + HSLArr[0] + ', ' + HSLArr[1] + ', ' + HSLArr[2] + ', ' + alpha + ')';
    formLoc.Hex.value = rgb2hex(RGBArr[0], RGBArr[1], RGBArr[2]);
}
setResult.hideOther = function (currentTab) {
    switch (currentTab) {
        case 'RGB':
            var visibleNames = ['HSL', 'Hex'];
            break;
        case 'RGBa':
            var visibleNames = ['HSLa'];
            break;
        case 'HSL':
            var visibleNames = ['RGB', 'Hex'];
            break;
        case 'HSLa':
            var visibleNames = ['RGBa'];
            break;
        case 'Hex':
            var visibleNames = ['RGB', 'HSL'];
            break;
        default:
            return;
    }
    var i,
        setResultLoc = document.getElementById('results'),
        setResultInputs = setResultLoc.getElementsByTagName('input');
    // init
    for (i = 0; i < setResultInputs.length; i++) {
        setResultInputs.item(i).parentElement.style.display = 'none';
    }
    // hide
    for (i = 0; i < visibleNames.length; i++) {
        setResultLoc[visibleNames[i]].parentElement.style.display = 'block';
    }
}

// addEvent
var handNms = ['change', 'keyup'];
for (var i = 0; i < handNms.length; i++) {
    document.getElementById('RGBform').addEventListener(handNms[i], function (evt) {
        fromRGB(evt.target.name, evt.target.value);
    }, false);
    document.getElementById('RGBaform').addEventListener(handNms[i], function (evt) {
        fromRGBa(evt.target.name, evt.target.value);
    }, false);
    /*document.getElementById('HSLform').addEventListener(handNms[i], function (evt) {
        fromRGB(evt.target.name, evt.target.value);
    }, false);
    document.getElementById('HSLaform').addEventListener(handNms[i], function (evt) {
        fromRGBa(evt.target.name, evt.target.value);
    }, false);
    document.getElementById('Hexform').addEventListener(handNms[i], function (evt) {
        fromRGB(evt.target.name, evt.target.value);
    }, false);*/
}

//
function getOtherValue(changedValueName, newValue) {
    // Return [r, g, b], 0 to 255.
    var rgbaValuesLoc = document.getElementById('RGBaform'),
        hslaValuesLoc = document.getElementById('HSLaform'),
        r, g, b,
        RGBaArr = [], HSLaArr = [],
        temp;
    if (changedValueName.search(/R|G|B|Hex|/) == -1) {
        switch (changedValueName) {
            // hsl
            case 'HSL':
                HSLaArr = newValue.replace(/[hsl();\s]/g, '').split(/,/);
                switch (HSLaArr.length) {
                    case 0:
                        HSLaArr[0] = 0;
                    case 1:
                        HSLaArr[1] = 0;
                    case 2:
                        HSLaArr[2] = 0;
                    case 3:
                        HSLaArr[3] = 1;
                        break;
                    default:
                        //window.alert('Invalid Value\nHSL: '+ newValue);
                        return;
                }
                break;
            case 'HSLa':
                HSLaArr = newValue.replace(/[hsla();\s]/g, '').split(/,/);
                switch (HSLaArr.length) {
                    case 0:
                        HSLaArr[0] = 0;
                    case 1:
                        HSLaArr[1] = 0;
                    case 2:
                        HSLaArr[2] = 0;
                    case 3:
                        HSLaArr[3] = 1;
                    case 4:
                        break;
                    default:
                        //window.alert('Invalid Value\nHSLa: '+ newValue);
                        return;
                }
            case 'rangeH':
            case 'numH':
                HSLaArr[0] = newValue;
                HSLaArr[1] = hslaValuesLoc.rangeS.value;
                HSLaArr[2] = hslaValuesLoc.rangeL.value;
                HSLaArr[3] = hslaValuesLoc.rangea.value;
                break;
            case 'rangeS':
            case 'numS':
                HSLaArr[0] = hslaValuesLoc.rangeH.value;
                HSLaArr[1] = newValue;
                HSLaArr[2] = hslaValuesLoc.rangeL.value;
                HSLaArr[3] = hslaValuesLoc.rangea.value;
                break;
            case 'rangeL':
            case 'numL':
                HSLaArr[0] = hslaValuesLoc.rangeH.value;
                HSLaArr[1] = hslaValuesLoc.rangeS.value;
                HSLaArr[2] = newValue;
                HSLaArr[3] = hslaValuesLoc.rangea.value;
                break;
            case 'rangea':
            case 'numa':
                HSLaArr[0] = hslaValuesLoc.rangeH.value;
                HSLaArr[1] = hslaValuesLoc.rangeS.value;
                HSLaArr[2] = hslaValuesLoc.rangeL.value;
                HSLaArr[3] = newValue;
                break;
            default:
                //window.alert('Internal Error\nchangedValueName: ' + changedValueName);
                return;
        }
        RGBaArr = hsl2rgb(HSLaArr[0], HSLaArr[1], HSLaArr[2]);
        RGBaArr[3] = HSLaArr[3];
    } else {
        switch (changedValueName) {
            // rgb
            case 'RGB':
                RGBaArr = newValue.replace(/[rgb();\s]/g, '').split(/,/);
                switch (RGBaArr.length) {
                    case 0:
                        RGBaArr[0] = 0;
                    case 1:
                        RGBaArr[1] = 0;
                    case 2:
                        RGBaArr[2] = 0;
                    case 3:
                        RGBaArr[3] = 1;
                        break;
                    default:
                        //window.alert('Invalid Value\nRGB: '+ newValue);
                        return;
                }
                break;
            case 'RGBa':
                RGBaArr = newValue.replace(/[rgba();\s]/g, '').split(/,/);
                switch (RGBaArr.length) {
                    case 0:
                        RGBaArr[0] = 0;
                    case 1:
                        RGBaArr[1] = 0;
                    case 2:
                        RGBaArr[2] = 0;
                    case 3:
                        RGBaArr[3] = 1;
                    case 4:
                        break;
                    default:
                        //window.alert('Invalid Value\nRGBa: '+ newValue);
                        return;
                }
            case 'numR16': // hex
                newValue = parseInt(newValue, 16);
            case 'rangeR':
            case 'numR':
                RGBaArr[0] = newValue;
                RGBaArr[1] = rgbaValuesLoc.rangeG.value;
                RGBaArr[2] = rgbaValuesLoc.rangeB.value;
                RGBaArr[3] = rgbaValuesLoc.rangea.value;
                break;
            case 'numG16': // hex
                newValue = parseInt(newValue, 16);
            case 'rangeG':
            case 'numG':
                RGBaArr[0] = rgbaValuesLoc.rangeR.value;
                RGBaArr[1] = newValue;
                RGBaArr[2] = rgbaValuesLoc.rangeB.value;
                RGBaArr[3] = rgbaValuesLoc.rangea.value;
                break;
            case 'numB16': // hex
                newValue = parseInt(newValue, 16);
            case 'rangeB':
            case 'numB':
                RGBaArr[0] = rgbaValuesLoc.rangeR.value;
                RGBaArr[1] = rgbaValuesLoc.rangeG.value;
                RGBaArr[2] = newValue;
                RGBaArr[3] = rgbaValuesLoc.rangea.value;
                break;
            case 'rangea':
            case 'numa':
                RGBaArr[0] = rgbaValuesLoc.rangeR.value;
                RGBaArr[1] = rgbaValuesLoc.rangeG.value;
                RGBaArr[2] = rgbaValuesLoc.rangeB.value;
                RGBaArr[3] = newValue;
                break;
                // hex
            case 'Hex':
                RGBaArr = hex2rgb(newValue);
                RGBaArr[3] = 1;
            default:
                //window.alert('Internal Error\nchangedValueName: ' + changedValueName);
                return;
        }
    }
    // regularization
    for (var i = 0; i < 3; i++) {
        temp = String(RGBaArr[i]);
        if (temp.search('%') != -1) {
            temp = temp.replace(/%$/, '') * 255 / 100;
        }
        RGBaArr[i] = parseFloat(temp);
        if (isNaN(RGBaArr[i]) || RGBaArr[i] < 0 || RGBaArr[i] > 255) {
            //window.alert('Invalid Value\nRGBa Array: '+ RGBaArr);
            return;
        }
    }
    RGBaArr[3] = parseFloat(RGBaArr[3]);
    if (isNaN(RGBaArr[3]) || RGBaArr[3] < 0 || RGBaArr[3] > 1) {
        //window.alert('Invalid Value\nRGBa Array: '+ RGBaArr);
        return;
    }
    return RGBaArr;
}

//
function fromRGB(changedValueName, newValue) {
    var appendFormLoc = document.getElementById('RGBform'),
        RGBArr = [];
    // get RGB value
    RGBArr = getOtherValue(changedValueName, newValue);
    // set
    var rgbStr = 'rgb(' + RGBArr[0] + ', ' + RGBArr[1] + ', ' + RGBArr[2] + ')',
        hsl = rgb2hsl(RGBArr[0], RGBArr[1], RGBArr[2]),
        hex = rgb2hex(RGBArr[0], RGBArr[1], RGBArr[2]);
    // set RGB value
    if (changedValueName != 'RGB') {
        appendFormLoc.RGB.value = rgbStr;
    }
    if (changedValueName != 'rangeR') {
        appendFormLoc.rangeR.value = RGBArr[0];
    }
    if (changedValueName != 'rangeG') {
        appendFormLoc.rangeG.value = RGBArr[1];
    }
    if (changedValueName != 'rangeB') {
        appendFormLoc.rangeB.value = RGBArr[2];
    }
    if (changedValueName != 'numR') {
        appendFormLoc.numR.value = RGBArr[0];
    }
    if (changedValueName != 'numG') {
        appendFormLoc.numG.value = RGBArr[1];
    }
    if (changedValueName != 'numB') {
        appendFormLoc.numB.value = RGBArr[2];
    }
    // set result to css
    var parentElemStyle = document.getElementById('colorLayer').style;
    parentElemStyle.backgroundColor = rgbStr;
    if (0.298912 * RGBArr[0] + 0.586611 * RGBArr[1] + 0.114478 * RGBArr[2] < 128) {
        parentElemStyle.color = '#fafafa';
    } else {
        parentElemStyle.color = '#222';
    }
    setResult('RGB', RGBArr);
}
function fromRGBa(changedValueName, newValue) {
    var appendFormLoc = document.getElementById('RGBaform'),
        RGBaArr = [];
    // get RGB value
    RGBaArr = getOtherValue(changedValueName, newValue);
    // set
    var rgbaStr = 'rgba(' + RGBaArr[0] + ', ' + RGBaArr[1] + ', ' + RGBaArr[2] + ', ' + RGBaArr[3] + ')',
        hsl = rgb2hsl(RGBaArr[0], RGBaArr[1], RGBaArr[2]);
    // set RGB value
    if (changedValueName != 'RGBa') {
        appendFormLoc.RGBa.value = rgbaStr;
    }
    if (changedValueName != 'rangeR') {
        appendFormLoc.rangeR.value = RGBaArr[0];
    }
    if (changedValueName != 'rangeG') {
        appendFormLoc.rangeG.value = RGBaArr[1];
    }
    if (changedValueName != 'rangeB') {
        appendFormLoc.rangeB.value = RGBaArr[2];
    }
    if (changedValueName != 'rangea') {
        appendFormLoc.rangea.value = RGBaArr[3];
    }
    if (changedValueName != 'numR') {
        appendFormLoc.numR.value = RGBaArr[0];
    }
    if (changedValueName != 'numG') {
        appendFormLoc.numG.value = RGBaArr[1];
    }
    if (changedValueName != 'numB') {
        appendFormLoc.numB.value = RGBaArr[2];
    }
    if (changedValueName != 'numa') {
        appendFormLoc.numa.value = RGBaArr[3];
    }
    // set result to css
    var parentElemStyle = document.getElementById('colorLayer').style;
    parentElemStyle.backgroundColor = rgbaStr;
    if (0.298912 * RGBaArr[0] + 0.586611 * RGBaArr[1] + 0.114478 * RGBaArr[2] < 128 && RGBaArr[3] > 0.5) {
        parentElemStyle.color = '#fafafa';
    } else {
        parentElemStyle.color = '#222';
    }
    setResult('RGBa', RGBaArr);
}

// utils
function rgb2hsl(r, g, b) {
    // Param: r, g and b are from 0 to 255
    // Return: h is from 0 to 360, s and l are from 0 to 100
    r /= 255;
    g /= 255;
    b /= 255;
    var h, s, l,
        max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        sum = max + min,
        delta = max - min;

    switch (max) {
        case min:
            h = 0;
            break;
        case r:
            h = 60 * (g - b) / delta;
            break;
        case g:
            h = 120 + 60 * (b - r) / delta;
            break;
        case b:
            h = 240 + 60 * (r - g) / delta;
            break;
    }
    while (h < 0) {
        h += 360;
    }

    l = sum / 2;

    if (l == 0 || l == 1) {
        s = 0;
    } else if (l < 0.5) {
        s = delta / sum;
    } else {
        s = delta / (2 - sum);
    }

    // now s and l are from 0 to 1 
    // h, s and l are decimals so...
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
function hsl2rgb(h, s, l) {
    // Param: h is from 0 to 360, s and l are from 0 to 100
    // Return: r, g and b are from 0 to 255
    while (h < 0) {
        h += 360;
    }
    while (h > 360) {
        h -= 360;
    }
    s /= 100;
    l /= 100;

    var r = 0, g = 0, b = 0,
        C = s * (1 - Math.abs(2 * l - 1)),
        X = C * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - C / 2;
    if (h < 60) {
        r = C;
        g = X;
    } else if (h < 120) {
        r = X;
        g = C;
    } else if (h < 180) {
        g = C;
        b = X;
    } else if (h < 240) {
        g = X;
        b = C;
    } else if (h < 300) {
        r = X;
        b = C;
    } else {
        r = C;
        b = X;
    }

    // Now r, g and b are from 0  to 1 so...
    // r, g and b are decimals so...
    return [Math.round(255 * (r + m)), Math.round(255 * (g + m)), Math.round(255 * (b + m))];
}
function rgb2hex(r, g, b) {
    // Param: r, g and b are from 0 to 255
    // Return: #rrggbb
    //window.alert(r * 65536 + g * 256 + b);
    var result = (r * 65536 + g * 256 + b).toString(16);
    while (result.length < 6) {
        result = '0' + result;
    }
    return '#' + result;
}
function hex2rgb(hex) {
    // Param: #rrggbb
    // Return: r, g and b are from 0 to 255
    hex = hex.replace("#", "");
    if (hex.length == 3) {
        var r = parseInt(hex.slice(0, 1), 16),
            g = parseInt(hex.slice(1, 2), 16),
            b = parseInt(hex.slice(2, 3), 16);
        return [r + r * 16, g + g * 16, b + b * 16];
    }
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

function judgeTextColor(r, g, b, a) {
    // Param: background r, g, b, a. r, g and b are from 0 to 255.
    // Return: textColor. 1 means white, 0 means black.
    if (0.298912 * r + 0.586611 * g + 0.114478 * b < 128 && a > 0.5) {
        return 1;
    } else {
        return 0;
    }
}