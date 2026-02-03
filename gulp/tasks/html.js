const gulp = require("gulp");
const fs = require("fs");
const cachebust = require("gulp-cache-bust");
const data = require("gulp-data");
const htmlmin = require("gulp-htmlmin");
const mode = require("gulp-mode")();
const nunjucksRender = require("gulp-nunjucks-render");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const paths = require("../paths");

// other htmlminConfig settings: https://github.com/kangax/html-minifier#options-quick-reference
const htmlminConfig = {
  minifyCSS: true, // Minify CSS in style elements and style attributes
  minifyJS: true, // Minify JavaScript in script elements and event attributes
  collapseWhitespace: true, // Collapse white space that contributes to text nodes in a document tree
  conservativeCollapse: true, // Always collapse to 1 space (never remove it entirely). Must be used in conjunction with collapseWhitespace=true
  removeComments: true, // Strip HTML comments
  removeScriptTypeAttributes: true, // Remove type="text/javascript" from script tags. Other type attribute values are left intact
  removeStyleLinkTypeAttributes: true, // Remove type="text/css" from style and link tags. Other type attribute values are left intact
  sortAttributes: true, // Sort attributes by frequency
};

const cachebustConfig = {
  type: "timestamp",
};

const manageEnvironment = function (environment) {
  environment.addFilter("json", function (value) {
    return JSON.parse(value); // convert the complete string imported by Nunjucks into JSON and return
  });
};

const getDataForFile = file => {
  const data = JSON.parse(fs.readFileSync('./src/json/data.json'));
  // Cache bust для спрайту — gulp-cache-bust не чіпає SVG <use href>
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  data.assetsVersion = process.argv.includes('--production')
    ? `${pkg.version}-${Date.now()}`
    : 'dev';
  return data;
};

const html = () => {
  return gulp
    .src(paths.src.html)
    .pipe(
      plumber({
        errorHandler: function (error) {
          // if error in dev mode
          notify.onError({
            title: "HTML",
            message: "Error: <%= error.message %>",
          })(error);

          // if error in production mode
          if (mode.production()) {
            console.error(`❌ Error: [HTML] ${error.message}`);
            process.exit(1);
          }
        },
      }),
    )
    .pipe(data(getDataForFile))
    .pipe(
      nunjucksRender({
        path: ["src/html/partials"],
        manageEnv: manageEnvironment, // set up the environment using the additional filter
        envOptions: {
          autoescape: false,
        },
        watch: true,
      }),
    )
    .pipe(mode.production(htmlmin(htmlminConfig)))
    .pipe(mode.production(cachebust(cachebustConfig)))
    .pipe(mode.production(rename({ extname: ".php" })))
    .pipe(gulp.dest(paths.build.html));
};

module.exports = { html };

