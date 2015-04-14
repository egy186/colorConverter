/* jshint node: true */

'use strict';

var config = require('../config').clean;
var del = require('del');
var gulp = require('gulp');

gulp.task('clean', function (callback) {
  del.sync(config);
});
