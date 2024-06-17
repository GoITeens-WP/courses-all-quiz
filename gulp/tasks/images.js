const gulp = require('gulp');
const newer = require('gulp-newer');
const rename = require('gulp-rename');
const size = require('gulp-size');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const paths = require('../paths');
const sharp = require('sharp');
const through2 = require('through2');
const svgmin = require('gulp-svgmin');

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

const imagesSvg = () => {
  return gulp
    .src([
      `${paths.src.images}/*.svg`,
      '!src/assets/images/components/favicon/**',
      '!src/assets/images/sprite/**',
      '!src/assets/images/components/intTelInput/**',
      '!src/assets/images/components/ogp/**',
    ])
    .pipe(
      plumber(
        notify.onError({
          title: 'IMAGESSVG',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(newer(paths.build.images))
    .pipe(svgmin()) // Минимизируем SVG файлы
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(paths.build.images));
};

const copyComponentsImages = () => {
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

const buildImages = gulp.series(imagesWebp, imagesSvg, copyComponentsImages);

module.exports = {
  buildImages,
};
