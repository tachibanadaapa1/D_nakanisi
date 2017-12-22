const gulp = require('gulp');

const rimraf = require('rimraf');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');

// HTML
const template = require('gulp-template');
const inject = require('gulp-inject');
// CSS
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
// SASS
const sass = require('gulp-sass');
// Webbpack
const webpackStream = require('webpack-stream');
const webpack = require('webpack');

const webpackConfig = require('./webpack.config');

// Server
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');

// tasks
gulp.task('clean', (callback) => {
  rimraf('./dest', callback);
});

gulp.task('html', () =>
  gulp
    .src('./app/**/*.html')
    .pipe(template({ message: 'Build success!' }))
    .pipe(gulp.dest('dest')));

gulp.task('webpack', () => webpackStream(webpackConfig, webpack).pipe(gulp.dest('./dest/js')));

gulp.task('minify-css', () =>
  gulp
    .src('./app/css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dest/css')));

gulp.task('scss', () =>
  gulp
    .src('./app/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest('./app/css')));

gulp.task('inject', () => {
  const target = gulp.src('./dest/**/*.html');
  const sources = gulp.src(['./dest/**/*.css', './dest/**/*.js']);
  return target.pipe(inject(sources, { relative: true })).pipe(gulp.dest('./dest'));
});

// server
gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('browser-sync', () => {
  watch('./app/scss/**/*.scss', () => {
    gulp.start('scss');
  });
  watch(['./app/**/*.html', './app/css/**/*.css', './app/js/**/*.js'], () => {
    runSequence('clean', ['html', 'minify-css', 'webpack'], 'inject', 'reload');
  });

  browserSync.init({
    server: {
      baseDir: './dest',
    },
  });
});

// build command
gulp.task('build', callback =>
  runSequence('clean', 'scss', ['html', 'minify-css', 'webpack'], 'inject', callback));

gulp.task('default', ['build']);
gulp.task('dev-server', callback => runSequence('build', 'browser-sync', callback));
