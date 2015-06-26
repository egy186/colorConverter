import { lint as config } from '../config';
import gulp from 'gulp';
import eslint from 'gulp-eslint';

gulp.task('lint:js', () => {
  return gulp.src(config.js.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint:js']);
