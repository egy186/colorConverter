/* global global */

export default (() => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
  if (!global.String.prototype.includes) {
    global.String.prototype.includes = function () {
      return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
  }
})(global);
