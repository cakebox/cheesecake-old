'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var ngconfig = require('gulp-ng-config');

gulp.task('scripts', function () {
  gulp.src(conf.paths.src + '/config/index.constants-env.json')
  .pipe(ngconfig('cheesecake', {
    environment: conf.options.mode,
    createModule: false,
    wrap: '(function () {\n    \'use strict\';\n\n<%= module %>\n})();'
  }))
  .pipe(gulp.dest(conf.paths.src + '/app/'));

  return gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe(browserSync.reload({ stream: true }))
    .pipe($.size())
});
