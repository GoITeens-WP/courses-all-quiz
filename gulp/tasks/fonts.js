const gulp = require('gulp');
const paths = require('../paths');

const fonts = done => {
  gulp.src(paths.src.fonts).pipe(gulp.dest(paths.build.fonts));

  done();
};

module.exports = fonts;
