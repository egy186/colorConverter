var del = require('del');
var gulp = require('gulp');
var install = require("gulp-install");
var mainBowerFiles = require('main-bower-files');

gulp.task('install', function () {
  return gulp.src('./bower.json')
    .pipe(install());
});

gulp.task('bower', ['install'], function () {
  var targetPath = 'lib';
  del.sync(targetPath);
  return gulp.src(mainBowerFiles(), { base: 'bower_components' })
    .pipe(gulp.dest(targetPath));
});

gulp.task('default', ['bower']);
