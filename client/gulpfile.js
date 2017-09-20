'use strict';

const gulp = require('gulp');
const liveReload = require('gulp-livereload');
const sass = require('gulp-sass');


const ROOTPATHS = {
  css: './client/public/css/**/*.scss',
  js: './client/public/libraries/dist/build.js'
};
const DISTPATHS = {
  css: './client/public/css'
}

gulp.task('sass', () => {
  return gulp.src(ROOTPATHS.css)
    .pipe(sass())
    .pipe(gulp.dest(DISTPATHS.css))
    .pipe(liveReload());
});

gulp.task('js', () => {
  return gulp.src(ROOTPATHS.js).pipe(liveReload());
});

gulp.task('watch', () => {
  liveReload.listen();
  gulp.watch(ROOTPATHS.css, ['sass']);
  gulp.watch(ROOTPATHS.js, ['js']);
});