import { watch as config } from '../config';
import gulp from 'gulp';

gulp.task('watch', ['server:start'], () => {
  gulp.watch(config.css, ['build:css']);
  gulp.watch(config.html, ['build:html']);
  gulp.watch(config.js, ['build:js']);
  gulp.watch(config.static, ['build:static']);
  gulp.watch(config.server, ['server:reload']);
});
