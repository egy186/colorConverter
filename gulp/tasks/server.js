/* jshint node: true */

'use strict';

var browserSync = require('browser-sync');
var config = require('../config').server;
var gulp = require('gulp');

gulp.task('server:start', function() {
  browserSync(config.options);
});

gulp.task('server:reload', function () {
  browserSync.reload();
});

gulp.task('server', ['server:start']);
