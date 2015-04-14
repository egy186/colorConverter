/* jshint node: true */

'use strict';

var config = require('../config').jade;
var gulp = require('gulp');
var jade = require('gulp-jade');

gulp.task('jade', function () {
  gulp.src(config.src)
    .pipe(jade(config.options))
    .pipe(gulp.dest(config.dest));
});
