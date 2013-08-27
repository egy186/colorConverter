/*
 * Modernizr method is:
 * Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: modernizr.com/download/#-inputtypes
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*
<p id="mynum">0</p>
<form id="_form">
    <div id="_div" class="_div">
        <input type="button" id="_range" class="_range" />
    </div>
</form>
*/

(function () {
    var dragging = false;
    var output = document.getElementById('mynum');
    var value = output.innerHTML;
    impRange = {};
    var slider = document.getElementsByClassName('_div');
    var input = document.getElementsByClassName('_range');
    //window.alert(value);
    var set_value = function () {
        // つまみのサイズ(input.clientWidth)だけ位置を調整
        input.style.left = (value - input.offsetWidth / 2) + 'px';
        //output.value = value;
        output.innerHTML = value;
    };
    for (var i = 0; i < input.length; i++) {
        input[i].style.left = (value - input[i].offsetWidth / 2) + 'px';
        output.innerHTML = value;
    }

    impRange.start = function (ev) {
        if (ev.target.className == '_div') {
            slider = ev.target;
            input = ev.target.childNodes[1];
            value = ev.clientX - slider.getBoundingClientRect().left;
            if (value < 0) {
                value = 0;
            } else if (value > slider.clientWidth) {
                value = slider.clientWidth;
            }
            dragging = true;
            set_value();
            return false;
        } else if (ev.target.className == '_range') {
            slider = ev.target.parentNode;
            input = ev.target;
            dragging = true;
            return false;
        }
    };
    impRange.end = function (ev) {
        dragging = false;
    };
    impRange.move = function (ev) {
        if (dragging) {
            //if (!evt) {
            //    evt = window.event;
            //}
            value = ev.clientX - slider.getBoundingClientRect().left;
            if (value < 0) {
                value = 0;
            } else if (value > slider.clientWidth) {
                value = slider.clientWidth;
            }
            set_value();
            return false;
        }
    };
    document.addEventListener('mousedown', impRange.start, false);
    document.addEventListener('mouseup', impRange.end, false);
    document.addEventListener('mousemove', impRange.move, false);
})();

// # IT DOESN'T WORK ?
//function html5_slider(node) {
//from http://gihyo.jp/dev/serial/01/crossbrowser-javascript/0023

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
