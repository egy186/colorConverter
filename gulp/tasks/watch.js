/* jshint node: true */

'use strict';

var config = require('../config').watch;
var gulp = require('gulp');

gulp.task('watch', ['server:start'], function() {
  gulp.watch(config.css, ['build:css']);
  gulp.watch(config.html, ['build:html']);
  gulp.watch(config.js, ['build:js']);
  gulp.watch(config.static, ['build:static']);
  gulp.watch(config.server, ['server:reload']);
});
