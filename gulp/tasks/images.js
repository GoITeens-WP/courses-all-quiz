const gulp = require('gulp');
const newer = require('gulp-newer');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const paths = require('../paths');

const images = () => {
  return gulp
    .src(['src/assets/images/components/**/*'])
    .pipe(
      plumber({
        errorHandler: function (error) {
          // if error in dev mode
          notify.onError({
            title: 'IMAGES',
            message: 'Error: <%= error.message %>',
          })(error);

          // if error in production mode
          if (mode.production()) {
            console.error(`❌ Error: [IMAGES] ${error.message}`);
            process.exit(1);
          }
        },
      })
    )
    .pipe(newer(paths.build.images))
    .pipe(gulp.dest(`${paths.build.images}/components/`));
};

module.exports = images;
