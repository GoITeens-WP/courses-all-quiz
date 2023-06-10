const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const paths = require('../paths');
const rename = require('gulp-rename');
const size = require('gulp-size');
const imageminWebp = require('imagemin-webp');

const imagesWebp = () => {
  return gulp
    .src([
      `${paths.src.images}/*.{jpg,png}`,
      '!src/assets/images/favicon/**',
      '!src/assets/images/intTelInput/**',
      '!src/assets/images/ogp/**',
    ])
    .pipe(newer(paths.build.images))
    .pipe(imagemin([imageminWebp({ quality: 75 })]))
    .pipe(rename({ extname: '.webp' }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(paths.build.images));
};

module.exports = imagesWebp;
