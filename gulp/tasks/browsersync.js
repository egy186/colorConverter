import browserSync from 'browser-sync';
import gulp from 'gulp';
import { browsersync as config } from '../config';

const bs = browserSync.create();

gulp.task('browsersync', () => {
  bs.watch(config.options.server.baseDir + '/**').on('change', bs.reload);
  bs.init(config.options);
});
