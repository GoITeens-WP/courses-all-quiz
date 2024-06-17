const gulp = require('gulp');
const concat = require('gulp-concat');
const mode = require('gulp-mode')();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('sass'));
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const tailwindcss = require('tailwindcss');
const cssnano = require('gulp-cssnano'); // Добавлен импорт cssnano
const paths = require('../paths');

const css = () => {
  return gulp
    .src(paths.src.css)
    .pipe(
      plumber({
        errorHandler: function (error) {
          // if error in dev mode
          notify.onError({
            title: 'CSS',
            message: 'Error: <%= error.message %>',
          })(error);

          // if error in production mode
          if (mode.production()) {
            console.error(`❌ Error: [CSS] ${error.message}`);
            process.exit(1);
          }
        },
      })
    )
    .pipe(mode.development(sourcemaps.init()))
    .pipe(
      sass({
        sourceMap: true,
        precision: 3,
        errLogToConsole: true,
      }).on('error', sass.logError)
    )
    .pipe(
      postcss(
        [
          require('postcss-import')(),
          tailwindcss('./tailwind.config.js'),
          require('tailwindcss/nesting'),
          require('autoprefixer'),
        ],
        {
          parser: require('postcss-scss'),
        }
      )
    )
    .pipe(concat({ path: 'style.css' }))
    .pipe(mode.development(cssnano()))
    .pipe(size({ showFiles: true }))
    .pipe(mode.development(sourcemaps.write('./')))
    .pipe(gulp.dest(paths.build.css));
};

module.exports = css;
