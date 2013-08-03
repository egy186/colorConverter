function fromRGB(changedValueName, newValue) {
    var appendFormLoc = document.getElementById('RGBform');
    var RGBArr = [];
    // get RGB value
    switch (changedValueName) {
        case 'RGB':
            RGBArr = newValue.replace(/\s/g, '').replace(/[rgb();]/g, '').split(/,/);
            switch (RGBArr.length) {
                case 2:
                    RGBArr[2] = 0;
                case 1:
                    RGBArr[1] = 0;
                case 3:
                    break;
                default:
                    return;
            }
            break;
        case 'rangeR':
        case 'numR':
            RGBArr[0] = parseFloat(newValue);
            RGBArr[1] = appendFormLoc.numG.valueAsNumber;
            RGBArr[2] = appendFormLoc.numB.valueAsNumber;
            break;
        case 'rangeG':
        case 'numG':
            RGBArr[0] = appendFormLoc.numR.valueAsNumber;
            RGBArr[1] = parseFloat(newValue);
            RGBArr[2] = appendFormLoc.numB.valueAsNumber;
            break;
        case 'rangeB':
        case 'numB':
            RGBArr[0] = appendFormLoc.numR.valueAsNumber;
            RGBArr[1] = appendFormLoc.numG.valueAsNumber;
            RGBArr[2] = parseFloat(newValue);
            break;
        default:
            return;
    }
    // regularization
    var temp
    for (var i = 0; i < 3; i++) {
        temp = String(RGBArr[i]);
        if (temp.search('%') != -1) {
            temp = temp.replace(/%$/, '') * 255 / 100;
        }
        RGBArr[i] = parseFloat(temp);
        if (isNaN(RGBArr[i]) || RGBArr[i] < 0 || RGBArr[i] > 255) {
            return;
        }
    }
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
    // set result
    appendFormLoc.RGBa.value = 'rgba(' + RGBArr[0] + ', ' + RGBArr[1] + ', ' + RGBArr[2] + ', 1)';
    appendFormLoc.HSL.value = 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';
    appendFormLoc.HSLa.value = 'hsla(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%, 1)';
    appendFormLoc.Hex.value = hex;
    // set result to css
    var parentElemStyle = appendFormLoc.parentElement.style;
    parentElemStyle.backgroundColor = rgbStr;
    if (0.298912 * RGBArr[0] + 0.586611 * RGBArr[1] + 0.114478 * RGBArr[2] < 128) {
        parentElemStyle.color = '#fafafa';
    } else {
        parentElemStyle.color = '#222';
    }
}
// # TODO
window.addEventListener('load', function () {
    var rundColor;
    if (location.search) {
        var queryObj = {};
        var tmp;
        var query = location.search.substring(1);
        query = query.split(/&/g);
        for (var i = 0; i < query.length; i++) {
            tmp = query[i].split('=');
            queryObj[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
        }
        rundColor = queryObj.q;
    } else {
        rundColor = 'rgb(' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ', ' + Math.floor(Math.random() * 256) + ')';
    }
    document.getElementById('RGBform').RGB.value = rundColor;
    fromRGB('RGB', rundColor);
}, false);
var formLoc = document.getElementById('RGBform');
formLoc.addEventListener('change', function (evt) {
    fromRGB(evt.target.name, evt.target.value);
}, false);
formLoc.addEventListener('keyup', function (evt) {
    fromRGB(evt.target.name, evt.target.value);
}, false);
formLoc.addEventListener('change', function (evt) {
    fromRGB(evt.target.name, evt.target.value);
}, false);
formLoc.RGBa.addEventListener('focus', function () {
    this.select();
}, false)
formLoc.HSL.addEventListener('focus', function () {
    this.select();
}, false)
formLoc.HSLa.addEventListener('focus', function () {
    this.select();
}, false)
formLoc.Hex.addEventListener('focus', function () {
    this.select();
}, false)


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



//function html5_slider(node) {

//    var addEvent = document.addEventListener ?
//      function (node, type, listener) {
//          node.addEventListener(type, listener, false);
//      } :
//      function (node, type, listener) {
//          node.attachEvent('on' + type, listener);
//      }
//    var removeEvent = document.removeEventListener ?
//      function (node, type, listener) {
//          node.removeEventListener(type, listener, false);
//      } :
//      function (node, type, listener) {
//          node.detachEvent('on' + type, listener);
//      }

//    var dragging = false;
//    var slider, button, input;
//    var min = 0, max = 100;
//    var value = 0;
//    function set_value() {
//        button.style.left = (value - button.clientWidth / 2) + 'px';
//        input.value = min + value;
//    }
//    if (!node) {
//        node = document;
//    }
//    var inputs = node.getElementsByTagName('input');
//    // getElementsByTagNameで取得した要素を走査中に置き換えると
//    // 繰り上がりされるので、繰り上がりが起きても良いように、
//    // 後ろから走査する
//    var n = inputs.length;
//    while (n) {
//        n--;
//        var _input = inputs[n];
//        var type = _input.getAttribute('type');
//        if (type === 'range' && !('step' in _input)) {
//            init(_input);
//        }
//    }
//    function init(_input) {
//        var parent = _input.parentNode;
//        var _min = parseInt(_input.getAttribute('min'), 10) || 0;
//        var _max = parseInt(_input.getAttribute('max'), 10) || 100;
//        value = parseInt(_input.value, 10) - _min || 0;

//        var outer = document.createElement('div');
//        var inner = document.createElement('div');
//        var _button = document.createElement('input');
//        _button.type = 'button';
//        outer.className = 'js-slider';
//        outer.style.width = (_max - _min) + 'px';
//        parent.insertBefore(outer, _input);
//        outer.appendChild(inner);
//        outer.appendChild(_button);
//        if (window.ActiveXObject) {
//            // IEはinputのtypeをhiddenに書き換えることができない
//            // 少々強引だが、outerHTMLについて置換を行う
//            parent.removeChild(_input);
//            _input = document.createElement(
//              _input.outerHTML.replace('type=range', 'type=hidden')
//            );
//            parent.insertBefore(_input, outer.nextSbling || null);
//        } else {
//            _input.type = 'hidden';
//        }
//        button = _button;
//        input = _input;
//        set_value();
//        addEvent(outer, 'click', function (evt) {
//            dragging = true;
//            min = _min;
//            max = _max;
//            input = _input;
//            button = _button;
//            slider = outer;
//            mousemove(evt);
//        });
//        addEvent(_button, 'mousedown', function (evt) {
//            if (!evt) {
//                evt = window.event;
//            }
//            dragging = true;
//            min = _min;
//            max = _max;
//            input = _input;
//            button = _button;
//            slider = outer;
//            if (evt.preventDefault) {
//                evt.preventDefault();
//            } else {
//                evt.returnValue = false;
//            }
//            addEvent(document, 'mousemove', mousemove);
//        });
//    }
//    addEvent(document, 'mouseup', function (evt) {
//        if (dragging) {
//            dragging = false;
//            removeEvent(document, 'mousemove', mousemove);
//            input = null;
//            button = null;
//            slider = null;
//        }
//    });
//    function mousemove(evt) {
//        if (!evt) {
//            evt = window.event;
//        }
//        if (dragging) {
//            var left = evt.clientX;
//            var rect = slider.getBoundingClientRect();
//            var width = button.clientWidth / 2;
//            // マウス座標とスライダーの位置関係で値を決める
//            value = Math.round(left - rect.left - width);
//            // スライダーからはみ出したとき
//            if (value < 0) {
//                value = 0;
//            } else if (value > slider.clientWidth) {
//                value = slider.clientWidth;
//            }
//            set_value();
//            if (evt.preventDefault) {
//                evt.preventDefault();
//            } else {
//                evt.returnValue = false;
//            }
//        }
//    }
//}


window.Modernizr = (function (window, document, undefined) {

    var version = '2.6.2',

    Modernizr = {},


    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem = document.createElement('input'),

    smile = ':)',

    toString = {}.toString, tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName,



    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
        hasOwnProp = function (object, property) {
            return _hasOwnProperty.call(object, property);
        };
    }
    else {
        hasOwnProp = function (object, property) {
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
    }


    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {

            var target = this;

            if (typeof target != "function") {
                throw new TypeError();
            }

            var args = slice.call(arguments, 1),
                bound = function () {

                    if (this instanceof bound) {

                        var F = function () { };
                        F.prototype = target.prototype;
                        var self = new F();

                        var result = target.apply(
                            self,
                            args.concat(slice.call(arguments))
                        );
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;

                    } else {

                        return target.apply(
                            that,
                            args.concat(slice.call(arguments))
                        );

                    }

                };

            return bound;
        };
    }

    function setCss(str) {
        mStyle.cssText = str;
    }

    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ';') + (str2 || ''));
    }

    function is(obj, type) {
        return typeof obj === type;
    }

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }


    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {

                if (elem === false) return props[i];

                if (is(item, 'function')) {
                    return item.bind(elem || obj);
                }

                return item;
            }
        }
        return false;
    }
    function webforms() {
        Modernizr['inputtypes'] = (function (props) {

            for (var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                if (bool) {

                    inputElem.value = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {

                        docElement.appendChild(inputElem);
                        defaultView = document.defaultView;

                        bool = defaultView.getComputedStyle &&
              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                                                                  (inputElem.offsetHeight !== 0);

                        docElement.removeChild(inputElem);

                    } else if (/^(search|tel)$/.test(inputElemType)) {
                    } else if (/^(url|email)$/.test(inputElemType)) {
                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                        bool = inputElem.value != smile;
                    }
                }

                inputs[props[i]] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
    }
    for (var feature in tests) {
        if (hasOwnProp(tests, feature)) {
            featureName = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    Modernizr.input || webforms();


    Modernizr.addTest = function (feature, test) {
        if (typeof feature == 'object') {
            for (var key in feature) {
                if (hasOwnProp(feature, key)) {
                    Modernizr.addTest(key, feature[key]);
                }
            }
        } else {

            feature = feature.toLowerCase();

            if (Modernizr[feature] !== undefined) {
                return Modernizr;
            }

            test = typeof test == 'function' ? test() : test;

            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature;
            }
            Modernizr[feature] = test;

        }

        return Modernizr;
    };


    setCss('');
    modElem = inputElem = null;


    Modernizr._version = version;


    return Modernizr;

})(this, this.document);
