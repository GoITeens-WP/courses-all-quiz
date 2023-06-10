const gulp = require('gulp');
const newer = require('gulp-newer');
const paths = require('../paths');
const size = require('gulp-size');
const svgSprite = require('gulp-svg-sprite');

const sprite = () => {
  return gulp
    .src(paths.src.sprite)
    .pipe(newer(paths.build.sprite))
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
    .pipe(gulp.dest(paths.build.sprite));
};

module.exports = sprite;
