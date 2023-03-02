const cachebust = require('gulp-cache-bust');
const data = require('gulp-data');
const fs = require('fs');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const mode = require('gulp-mode')();
const nunjucksRender = require('gulp-nunjucks-render');
const paths = require('../paths');
const rename = require('gulp-rename');

const htmlminConfig = {
  removeComments: true, // Strip HTML comments
};

const cachebustConfig = {
  type: 'timestamp',
};

const manageEnvironment = function (environment) {
  environment.addFilter('json', function (value) {
    return JSON.parse(value); // convert the complete string imported by Nunjucks into JSON and return
  });
};

const getDataForFile = file => {
  return JSON.parse(fs.readFileSync('./src/json/data.json'));
};

const html = () => {
  return gulp
    .src(paths.src.html)
    .pipe(data(getDataForFile))
    .pipe(
      nunjucksRender({
        path: ['src/html/partials'],
        manageEnv: manageEnvironment, // set up the environment using the additional filter
        envOptions: {
          autoescape: false,
        },
        watch: true,
      })
    )
    .pipe(mode.production(htmlmin(htmlminConfig)))
    .pipe(mode.production(cachebust(cachebustConfig)))
    .pipe(mode.production(rename({ extname: '.php' })))
    .pipe(gulp.dest(paths.build.html));
};

module.exports = { html };
