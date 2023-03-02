const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const paths = require('../paths');
const rename = require('gulp-rename');
const size = require('gulp-size');
const webp = require('imagemin-webp');

const imagesWebp = done => {
  return gulp
    .src([
      `${paths.src.images}/*.{jpg,png}`,
      `!src/assets/images/ogp/*.{jpg,png}`,
      `!src/assets/images/favicon/*.{jpg,png}`,
      `!src/assets/images/intTelInput/*.{jpg,png,webp}`,
      `!src/assets/images/countrySelect/*.{jpg,png,webp}`,
    ])
    .pipe(newer(paths.build.images))
    .pipe(
      imagemin([
        webp({
          quality: 75,
          // lossless: true, // if pngs turn out sucky uncomment this and redo just pngs
        }),
      ])
    )
    .pipe(rename({ extname: '.webp' }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(paths.build.images));

  done();
};

module.exports = imagesWebp;
