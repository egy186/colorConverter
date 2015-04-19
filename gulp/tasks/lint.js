/* jshint node: true */

'use strict';

var config = require('../config').lint;
var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint:js', function () {
  gulp.src(config.js.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint', ['lint:js']);
