/* jshint node: true */

'use strict';

var Bluebird = require('bluebird');
var bower = require('bower');
var config = require('../config').bower;
var gulp = require('gulp');
var gutil = require('gulp-util');
var mainBowerFiles = require('main-bower-files');

gulp.task('bower:install', function () {
  return new Bluebird(function (resolve, reject) {
    bower.commands.install().on('log', function (log) {
      gutil.log('bower:', log.id.cyan, log.message);
    }).on('end', function (installed) {
      resolve(installed);
    }).on('error', function (err) {
      reject(err);
    });
  });
});

gulp.task('bower', ['bower:install'], function () {
  return gulp.src(mainBowerFiles(), { base: 'bower_components' })
    .pipe(gulp.dest(config.dest));
});
