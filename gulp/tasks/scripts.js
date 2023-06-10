const babel = require('gulp-babel');
const concat = require('gulp-concat');
const gulp = require('gulp');
const mode = require('gulp-mode');
const notify = require('gulp-notify');
const paths = require('../paths');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const webpack = require('webpack');
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
