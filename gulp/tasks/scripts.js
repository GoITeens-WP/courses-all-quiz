const gulp = require('gulp');
const notify = require('gulp-notify');
const paths = require('../paths');
const plumber = require('gulp-plumber');
const webpackStream = require('webpack-stream');

const scripts = () => {
  return gulp
    .src(paths.src.js)
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: 'JS Error',
            message: 'Error: <%= error.message %>',
          })(err);
          this.emit('end');
        },
      })
    )
    .pipe(
      webpackStream({
        mode: 'production',
        output: {
          filename: 'app.js',
        },
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest(paths.build.js));
};

module.exports = scripts;
