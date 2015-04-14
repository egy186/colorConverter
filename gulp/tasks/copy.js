/* jshint node: true */

'use strict';

var config = require('../config').copy;
var gulp = require('gulp');

gulp.task('copy', function () {
  gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});
