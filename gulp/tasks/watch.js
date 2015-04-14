/* jshint node: true */

'use strict';

var config = require('../config');
var gulp = require('gulp');

gulp.task('watch', ['server:start'], function() {
  gulp.watch(config.browserify.src, ['browserify']);
  gulp.watch(config.copy.src, ['copy']);
  gulp.watch(config.jade.src, ['jade']);
  gulp.watch(config.less.src, ['less']);
  gulp.watch(config.server.server.baseDir + '/*', ['server:reload']);
});
