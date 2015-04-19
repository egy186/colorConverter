/* jshint node: true */

'use strict';

var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var config = require('../config').build;
var gulp = require('gulp');
var jade = require('gulp-jade');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('build:css', function () {
  gulp.src(config.css.src)
    .pipe(less())
    .pipe(minify())
    .pipe(gulp.dest(config.css.dest));
});

gulp.task('build:html', function () {
  gulp.src(config.html.src)
    .pipe(jade(config.html.options))
    .pipe(gulp.dest(config.html.dest));
});

gulp.task('build:js', function () {
  var distName = config.js.src.replace(/^.*\//, '').replace(/\..*$/, '');
  browserify().transform(babelify).require(config.js.src, { entry: true }).bundle()
    .pipe(source(distName + '.js'))
    .pipe(buffer())
    .pipe(gulp.dest(config.js.dest))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename(distName + '.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.js.dest));
});

gulp.task('build:static', ['bower'], function () {
  gulp.src(config.static.src)
    .pipe(gulp.dest(config.static.dest));
});

gulp.task('build:browser', ['build:css', 'build:html', 'build:js', 'build:static']);

gulp.task('build', ['build:browser']);
