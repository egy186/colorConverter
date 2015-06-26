/* eslint-env node */

import jsonfile from 'jsonfile';
import path from 'path';

const pkg = jsonfile.readFileSync(path.join(__dirname, './../package.json'));

const src = './src';
const dest = './dist';

export const bower = {
  dest: src + '/static/lib'
};

export const build = {
  css: {
    src: src + '/less/**/*.less',
    dest: dest + '/css'
  },
  html: {
    src: src + '/jade/**/*.jade',
    dest,
    options: {
      data: {
        version: 'v' + pkg.version
      }
    }
  },
  js: {
    src: src + '/js/app.js',
    dest: dest + '/js'
  },
  source: {
    src: [src + '/less/**/*.less', src + '/js/**/*.js'],
    dest: dest + '/source'
  },
  static: {
    src: src + '/static/**',
    dest
  }
};

export const clean = dest;

export const lint = {
  js: {
    src: ['gulpfile.babel.js', 'gulp/**/*.js', src + '/js/**/*.js']
  }
};

export const server = {
  options: {
    notify: false,
    open: false,
    server: {
      baseDir: dest
    }
  }
};

export const watch = {
  css: src + '/less/**/*.less',
  html: src + '/jade/**/*.jade',
  js: src + '/js/**/*.js',
  static: src + '/static/**',
  server: dest + '/**'
};
