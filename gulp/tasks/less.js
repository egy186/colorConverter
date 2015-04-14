/* jshint node: true */

'use strict';

var config = require('../config').less;
var gulp = require('gulp');
var less = require('gulp-less');
var minify = require('gulp-minify-css');

gulp.task('less', function () {
  gulp.src(config.src)
    .pipe(less())
    .pipe(minify())
    .pipe(gulp.dest(config.dest));
});
