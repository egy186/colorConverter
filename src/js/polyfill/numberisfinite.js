/* global global */

export default (() => {
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
  global.Number.isFinite = global.Number.isFinite || function (value) {
    return typeof value === 'number' && isFinite(value);
  };
})(global);
