/* jshint node: true */

'use strict';

var jf = require('jsonfile');
var path = require('path');

var pkg = jf.readFileSync(path.join(__dirname + './../package.json'));

var src = './src';
var dest = './dist';

module.exports = {
  bower: {
    dest: src + '/static/lib'
  },
  build: {
    css: {
      src: src + '/less/**/*.less',
      dest: dest + '/css'
    },
    html: {
      src: src + '/jade/**/*.jade',
      dest: dest,
      options: {
        data: {
          version: 'v' + pkg.version
        }
      }
    },
    js: {
      src: src + '/js/app.js',
      dest: dest + '/js'
    },
    source: {
      src: [src + '/less/**/*.less', src + '/js/**/*.js'],
      dest: dest + '/source'
    },
    static: {
      src: src + '/static/**',
      dest: dest
    }
  },
  clean: dest,
  lint: {
    js: {
      src: ['gulp/**/*.js', 'src/js/**/*.js'],
    },
  },
  server: {
    options: {
      notify: false,
      open: false,
      server: {
        baseDir: dest
      }
    }
  },
  watch: {
    css: src + '/less/**/*.less',
    html: src + '/jade/**/*.jade',
    js: src + '/js/**/*.js',
    static: src + '/static/**',
    server: dest + '/**'
  }
};
