const gulp = require('gulp');
const newer = require('gulp-newer');
const size = require('gulp-size');
const svgSprite = require('gulp-svg-sprite');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const paths = require('../paths');

const sprite = () => {
  return gulp
    .src(paths.src.sprite)
    .pipe(
      plumber({
        errorHandler: function (error) {
          // if error in dev mode
          notify.onError({
            title: 'SPRITE',
            message: 'Error: <%= error.message %>',
          })(error);

          // if error in production mode
          if (mode.production()) {
            console.error(`❌ Error: [SPRITE] ${error.message}`);
            process.exit(1);
          }
        },
      })
    )
    .pipe(newer(paths.build.images))
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(paths.build.images));
};

module.exports = sprite;
