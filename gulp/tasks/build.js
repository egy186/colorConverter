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
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('build:css', function () {
  gulp.src(config.css.src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(minify())
    .pipe(sourcemaps.write('.', { sourceRoot: '../source' }))
    .pipe(gulp.dest(config.css.dest));
});

gulp.task('build:html', function () {
  gulp.src(config.html.src)
    .pipe(jade(config.html.options))
    .pipe(gulp.dest(config.html.dest));
});

gulp.task('build:js', function () {
  var distName = config.js.src.replace(/^.*\//, '').replace(/\..*$/, '');
  browserify({ debug: true }).transform(babelify).require(config.js.src, { entry: true }).bundle()
    .pipe(source(distName + '.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.', { sourceRoot: '../source' }))
    .pipe(gulp.dest(config.js.dest));
});

gulp.task('build:source', function () {
  gulp.src(config.source.src)
    .pipe(gulp.dest(config.source.dest));
});

gulp.task('build:static', ['bower'], function () {
  gulp.src(config.static.src)
    .pipe(gulp.dest(config.static.dest));
});

gulp.task('build:browser', ['build:css', 'build:html', 'build:js', 'build:source', 'build:static']);

gulp.task('build', ['build:browser']);
