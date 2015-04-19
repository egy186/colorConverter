/* jshint node: true */

'use strict';

var bower = require('bower');
var config = require('../config').bower;
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');

gulp.task('bower:install', function (callback) {
  bower.commands.install().on('end', function () {
    callback();
  }).on('error', function (err) {
    callback(err);
  });
});

gulp.task('bower', ['bower:install'], function () {
  return gulp.src(mainBowerFiles(), { base: 'bower_components' })
    .pipe(gulp.dest(config.dest));
});
