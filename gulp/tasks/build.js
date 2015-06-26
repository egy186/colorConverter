import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import { build as config } from '../config';
import gulp from 'gulp';
import jade from 'gulp-jade';
import less from 'gulp-less';
import minify from 'gulp-minify-css';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

gulp.task('build:css', () => {
  return gulp.src(config.css.src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(minify())
    .pipe(sourcemaps.write('.', { sourceRoot: '../source' }))
    .pipe(gulp.dest(config.css.dest));
});

gulp.task('build:html', () => {
  return gulp.src(config.html.src)
    .pipe(jade(config.html.options))
    .pipe(gulp.dest(config.html.dest));
});

gulp.task('build:js', () => {
  const distName = config.js.src.replace(/^.*\//, '').replace(/\..*$/, '');
  return browserify({ debug: true }).transform(babelify).require(config.js.src, { entry: true }).bundle()
    .pipe(source(distName + '.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.', { sourceRoot: '../source' }))
    .pipe(gulp.dest(config.js.dest));
});

gulp.task('build:source', () => {
  return gulp.src(config.source.src)
    .pipe(gulp.dest(config.source.dest));
});

gulp.task('build:static', ['bower'], () => {
  return gulp.src(config.static.src)
    .pipe(gulp.dest(config.static.dest));
});

gulp.task('build:browser', ['build:css', 'build:html', 'build:js', 'build:source', 'build:static']);

gulp.task('build', ['build:browser']);
