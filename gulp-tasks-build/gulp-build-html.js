const fs = require('fs');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const data = require('gulp-data');
const inject = require('gulp-inject');
const nunjucks = require('gulp-nunjucks');
const plumber = require('gulp-plumber');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
let dateFilter = require('nunjucks-date-filter-locale');
const localeSettings = require('../src/data/site.json');
dateFilter.setLocale(localeSettings.meta.lang);

/**
 * @description Compile Nunjucks templates and replaces variable from JSON
 * @param {string,object} input Path with filter to source files
 * @param {string} output Path to save compiled files
 * @param {string} dataSource Input file with data structure
 * @param {string} rename Custom name of file
 * @param {string} injectCss Path to css files which you want inject
 * @param {array} injectJs Path to JS files which you want inject
 * @param {array} injectCdnJs Path to CDN JS files which you want inject
 * @return {stream} Compiled file
 */

const buildHtml = (params) => {
  let existsJson;
  let renameCondition;

  if (params.rename) {
    renameCondition = true;
  } else {
    renameCondition = false;
  }

  if (typeof params.dataSource !== 'object') {
    params.dataSource = [params.dataSource];
  }

  params.dataSource.forEach((element) => {
    try {
      fs.accessSync(element);
      existsJson = true;
    } catch (error) {
      console.log(`JSON file ${element} doesn't exists.`);
      existsJson = false;
    }
  });

  return gulp
    .src(params.input)
    .pipe(plumber())
    .pipe(
      gulpif(
        existsJson,
        data(function () {
          let file;
          params.dataSource.forEach((element) => {
            file = {
              ...file,
              ...JSON.parse(fs.readFileSync(element)),
            };
          });
          return file;
        })
      )
    )
    .pipe(
      inject(gulp.src(params.injectCss, { read: false }), {
        relative: false,
        ignorePath: 'build',
        addRootSlash: true,
        removeTags: true,
      })
    )
    .pipe(
      inject(gulp.src(params.injectJs, { read: false }), {
        relative: false,
        ignorePath: 'build',
        addRootSlash: true,
        removeTags: true,
      })
    )
    .pipe(
      nunjucks.compile('', {
        filters: {
          date: dateFilter,
        },
      })
    )
    .pipe(
      replace(
        '<!-- inject: bootstrap js -->',
        params.injectCdnJs.toString().replace(/[, ]+/g, ' ')
      )
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(
      gulpif(
        renameCondition,
        rename({
          dirname: '/',
          basename: params.rename,
          extname: '.html',
        })
      )
    )
    .pipe(gulp.dest(params.output))
    .on('end', params.cb);
};

module.exports = buildHtml;
