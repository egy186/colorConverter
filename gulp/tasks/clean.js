import { clean as config } from '../config';
import del from 'del';
import gulp from 'gulp';

gulp.task('clean', callback => {
  del(config, callback);
});
