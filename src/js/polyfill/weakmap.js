/* global global */
/* jshint esnext: true */

'use strict';

// https://www.npmjs.com/package/weakmap-shim
import WeakMap from 'weakmap-shim';

export default ((global) => {
  if (!global.WeakMap) {
    global.WeakMap = WeakMap;
  }
})(global);
