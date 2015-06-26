import browserSync from 'browser-sync';
import { server as config } from '../config';
import gulp from 'gulp';

gulp.task('server:start', () => {
  browserSync(config.options);
});

gulp.task('server:reload', () => {
  browserSync.reload();
});

gulp.task('server', ['server:start']);
