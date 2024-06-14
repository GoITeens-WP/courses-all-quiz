const gulp = require('gulp');
const newer = require('gulp-newer');
const rename = require('gulp-rename');
const size = require('gulp-size');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const paths = require('../paths');
const sharp = require('sharp');
const through2 = require('through2');

const imagesWebp = () => {
  return gulp
    .src([
      `${paths.src.images}/*.{jpg,png}`,
      '!src/assets/images/components/favicon/**',
      '!src/assets/images/components/intTelInput/**',
      '!src/assets/images/components/ogp/**',
    ])
    .pipe(
      plumber(
        notify.onError({
          title: 'IMAGESWEBP',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(newer(paths.build.images))
    .pipe(
      through2.obj(function (file, _, cb) {
        if (file.isBuffer() && /\.(jpe?g|png)$/i.test(file.path)) {
          sharp(file.contents)
            .webp({ quality: 100 })
            .toBuffer()
            .then(data => {
              file.contents = data;
              cb(null, file);
            })
            .catch(err => cb(err));
        } else {
          cb(null, file);
        }
      })
    )
    .pipe(rename({ extname: '.webp' }))
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(paths.build.images));
};

module.exports = imagesWebp;
