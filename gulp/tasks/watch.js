/* jshint node: true */

'use strict';

var config = require('../config');
var gulp = require('gulp');

gulp.task('watch', ['server:start'], function() {
  gulp.watch(config.build.css.src, ['build:css']);
  gulp.watch(config.build.html.src, ['build:html']);
  gulp.watch(config.build.js.src, ['build:js']);
  gulp.watch(config.build.static.src, ['build:static']);
  gulp.watch(config.server.options.server.baseDir + '/*', ['server:reload']);
});
