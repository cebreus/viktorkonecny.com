const gulp = require('gulp');
const plumber = require('gulp-plumber');
const purgecss = require('gulp-purgecss');

/**
 * @description Purge unused CSS selectors
 * @param {string} inputCss path to source CSS files
 * @param {string} inputHtml path to source HTML files
 * @param {string} outputCss path to folder to save optimized files
 * @return {stream} processed files
 */

const purgeCss = (inputCss, inputHtml, outputCss) => {
  return gulp
    .src(inputCss)
    .pipe(plumber())
    .pipe(
      purgecss({
        content: inputHtml,
      })
    )
    .pipe(gulp.dest(outputCss));
};

module.exports = purgeCss;
