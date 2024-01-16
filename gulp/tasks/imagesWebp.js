const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const mode = require('gulp-mode')();
const newer = require('gulp-newer');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const webp = require('gulp-webp');
const paths = require('../paths');

const imagesWebp = () => {
  return gulp
    .src(['src/assets/images/sections/**/*'])
    .pipe(
      plumber({
        errorHandler: function (error) {
          // if error in dev mode
          notify.onError({
            title: 'IMAGESWEBP',
            message: 'Error: <%= error.message %>',
          })(error);

          // if error in production mode
          if (mode.production()) {
            console.error(`❌ Error: [IMAGESWEBP] ${error.message}`);
            process.exit(1);
          }
        },
      })
    )
    .pipe(newer(paths.build.images))
    .pipe(
      mode.production(
        imagemin([
          imagemin.svgo({
            plugins: [
              { cleanupIDs: false },
              { removeViewBox: true },
              { removeComments: true },
              { removeEmptyContainers: true },
            ],
          }),
        ])
      )
    )
    .pipe(webp())
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(`${paths.build.images}/sections/`));
};

module.exports = imagesWebp;
