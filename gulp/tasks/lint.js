/* jshint node: true */

'use strict';

var config = require('../config').lint;
var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('lint:js', function () {
  gulp.src(config.js.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint:js']);
