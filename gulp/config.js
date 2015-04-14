/* jshint node: true */

'use strict';

var pkg = require('../package.json');

var src = './src';
var dest = './dist';

module.exports = {
  bower: {
    dest: dest + '/lib'
  },
  browserify: {
    src: src + '/js/colorconverter.js',
    dest: dest + '/js'
  },
  clean: dest,
  copy: {
    src: src + '/static/*',
    dest: dest
  },
  jade: {
    src: src + '/jade/**/*.jade',
    dest: dest,
    options: {
      data: {
        version: 'v' + pkg.version
      }
    }
  },
  jshint: {
    src: ['gulp/**/*.js', 'src/js/**/*.js'],
  },
  less: {
    src: src + '/less/**/*.less',
    dest: dest + '/css'
  },
  server: {
    notify: false,
    open: false,
    server: {
      baseDir: dest
    }
  }
};
