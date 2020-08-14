const gulp = require('gulp');
const fs = require('fs');

const buildDatasetFnc = require('./gulp-tasks/gulp-build-dataset');
const buildHtmlFnc = require('./gulp-tasks-build/gulp-build-html');
const compileSassFnc = require('./gulp-tasks-build/gulp-compile-sass');
// const concatFilesFnc = require('./gulp-tasks-build/gulp-concat-files');
const imagesFnc = require('./gulp-tasks/gulp-optimize-images');
const processJsFnc = require('./gulp-tasks-build/gulp-process-js');
const sourceMarkdownFnc = require('./gulp-tasks/gulp-source-markdown');

const buildBlogFnc = require('./gulp-tasks/gulp-build-blog');
const cleanFnc = require('./gulp-tasks-build/gulp-clean');
const faviconsFnc = require('./gulp-tasks/gulp-favicons');
const purgeCssFnc = require('./gulp-tasks-build/gulp-purgecss');
const replaceHashFnc = require('./gulp-tasks-build/gulp-sri-hash');
const revisionFnc = require('./gulp-tasks-build/gulp-revision');

// Variables
// --------------

const config = require('./gulpconfig-build');

// Gulp functions
// --------------

function buildDataset(done) {
  buildDatasetFnc(
    config.datasetJsonBase,
    config.datasetJsonBuild,
    config.datasetJsonFileName,
    () => {
      done();
    }
  );
}

function mergeDatasets(done) {
  buildDatasetFnc(
    config.datasetJsonWBlog,
    config.datasetJsonBuild,
    config.datasetJsonFileName,
    () => {
      done();
    }
  );
}

function sourceMarkdown(done) {
  sourceMarkdownFnc(
    config.sourceMarkdownBase,
    config.sourceMarkdownBuild,
    () => {
      done();
    }
  );
}

function buildHtml(done) {
  const params = {
    input: config.tplMain,
    output: config.tplBuild,
    dataSource: config.tplDataset,
    injectCdnJs: config.injectCdnJs,
    injectJs: config.injectJs,
    injectCss: config.injectCss,
    cb: () => {
      done();
    },
  };
  buildHtmlFnc(params);
}

function buildBlogPages(done) {
  fs.readdir(config.tplBlogDatasetFolder, (err, files) => {
    files.forEach((file) => {
      if (file !== 'index.json') {
        const params = {
          input: config.tplBlogDetail,
          output: config.tplBuildBlog + `/${file.replace(/\.[^/.]+$/, '')}`,
          dataSource: [
            config.tplBlogDatasetFolder + file,
            config.tplBlogDataset,
          ],
          injectCdnJs: config.injectCdnJs,
          injectJs: config.injectJs,
          injectCss: config.injectCss,
          rename: 'index',
          cb: () => {
            done();
          },
        };
        buildHtmlFnc(params);
      }
    });
  });
  done();
}

function buildBlogList(done) {
  fs.readdir(config.blogDatasetFolder, (err, files) => {
    files.forEach((file, index) => {
      const name = index === 0 ? 'index' : `page-${index + 1}`;
      const params = {
        input: config.blogListTemplate,
        output: config.tplBuildBlog,
        dataSource: [
          `${config.blogDatasetFolder}/${file}`,
          config.tplBlogDataset,
        ],
        injectCdnJs: config.injectCdnJs,
        injectJs: config.injectJs,
        injectCss: config.injectCss,
        rename: name,
        cb: () => {
          done();
        },
      };
      buildHtmlFnc(params);
    });
  });
}

// function concatFiles() {
//   return concatFilesFnc(config.jsFiles, config.jsBuild, 'index.min.js');
// }

function processJs() {
  return processJsFnc(config.jsFiles, config.jsBuild, {
    concatFiles: true,
    outputConcatPrefixFileName: 'app',
  });
}

function favicons() {
  return faviconsFnc(
    config.faviconSourceFile,
    config.faviconBuild,
    config.faviconGenConfig
  );
}

function images(done) {
  imagesFnc.optimizeJpg(config.jpgImages, config.gfxBuild);
  imagesFnc.optimizePng(config.pngImages, config.gfxBuild);
  imagesFnc.optimizeSvg(config.svgImages, config.gfxBuild);

  done();
}

function cleanFolders() {
  cleanFnc(config.tempBase);
  return cleanFnc(config.buildBase);
}

function cleanFiles() {
  return cleanFnc(config.buildRevManifest);
}

function compileSassAll() {
  return compileSassFnc(
    config.sassAll,
    config.sassBuild,
    'index.min.css',
    config.postcssPluginsBase
  );
}

function builBlog(done) {
  buildBlogFnc(config.tplBlogDataset, config.blogDatasetFolder);

  done();
}

function replaceHash() {
  return replaceHashFnc(`${config.buildBase}/*.html`, config.buildBase);
}

function revision() {
  const params = {
    inputRevision: `${config.buildBase}/**/*.css`,
    outputRevision: config.buildBase,
    ouputManifest: `${config.tempBase}/revision`,
    inputRewrite: `${config.buildBase}/*.html`,
    outputRewrite: config.buildBase,
    manifestFile: `${config.tempBase}/revision/*.json`,
  };
  return revisionFnc(params);
}

function purgecss() {
  return purgeCssFnc(
    `${config.buildBase}/**/*.css`,
    [`${config.buildBase}/**/*.html`],
    config.buildBase
  );
}

// Gulp tasks
// --------------

gulp.task('build:css', gulp.parallel(compileSassAll));
gulp.task('cleanup', cleanFolders);
gulp.task('favicons', favicons);
gulp.task('images', images);

// Aliases

gulp.task(
  'default',
  gulp.series(
    cleanFolders,
    sourceMarkdown,
    buildDataset,
    processJs,
    // concatFiles,
    mergeDatasets,
    compileSassAll,
    revision,
    buildBlogPages,
    builBlog,
    buildHtml,
    buildBlogList,
    purgecss,
    replaceHash,
    favicons,
    images,
    cleanFiles
  )
);
