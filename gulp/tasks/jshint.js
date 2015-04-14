/* jshint node: true */

'use strict';

var config = require('../config').jshint;
var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('jshint', function () {
  gulp.src(config.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});
