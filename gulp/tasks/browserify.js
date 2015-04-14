/* jshint node: true */

'use strict';

var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var config = require('../config').browserify;
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var distName = config.src.replace(/^.*\//, '').replace(/\..*$/, '');

gulp.task('browserify', function () {
  browserify().transform(babelify).require(config.src, { entry: true }).bundle()
    .pipe(source(distName + '.js'))
    .pipe(buffer())
    .pipe(gulp.dest(config.dest))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename(distName + '.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest));
});
