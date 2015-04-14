/* jshint node: true */

'use strict';

var gulp = require('gulp');

gulp.task('build:browser', ['bower', 'jade', 'less', 'browserify', 'copy']);

gulp.task('build', ['build:browser']);
