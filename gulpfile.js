const gulp = require('gulp');
const fs = require('fs');

const buildDatasetFnc = require('./gulp-tasks/gulp-build-dataset');
const buildHtmlFnc = require('./gulp-tasks/gulp-build-html');
const compileSassFnc = require('./gulp-tasks/gulp-compile-sass');
const concatFilesFnc = require('./gulp-tasks/gulp-concat-files');
const imagesFnc = require('./gulp-tasks/gulp-optimize-images');
const sourceMarkdownFnc = require('./gulp-tasks/gulp-source-markdown');

const buildBlogFnc = require('./gulp-tasks/gulp-build-blog');
const cleanFnc = require('./gulp-tasks-build/gulp-clean');
const fixCssFnc = require('./gulp-tasks/gulp-css-fix');
const fontLoadFnc = require('./gulp-tasks/gulp-font-load');
const hotReload = require('./gulp-tasks/gulp-hotreload');
const lintCssFnc = require('./gulp-tasks/gulp-css-lint');

// Variables
// --------------

const config = require('./gulpconfig');

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

function concatFiles() {
  return concatFilesFnc(config.jsFiles, config.jsBuild, 'app.js');
}

function images(done) {
  imagesFnc.optimizeJpg(config.jpgImages, config.gfxBuild, {
    rewriteExisting: true,
  });
  imagesFnc.optimizePng(config.pngImages, config.gfxBuild, {
    rewriteExisting: true,
  });
  imagesFnc.optimizeSvg(config.svgImages, config.gfxBuild, {
    rewriteExisting: true,
  });

  done();
}

function cleanFolders() {
  cleanFnc(config.tempBase);
  return cleanFnc(config.buildBase);
}

function builBlog(done) {
  buildBlogFnc(config.tplBlogDataset, config.blogDatasetFolder);

  done();
}

function compileSassCore() {
  return compileSassFnc(
    config.sassCore,
    config.sassBuild,
    'bootstrap.css',
    config.postcssPluginsBase
  );
}

function compileSassCustom() {
  return compileSassFnc(
    config.sassCustom,
    config.sassBuild,
    'custom.css',
    config.postcssPluginsBase
  );
}

function compileSassUtils() {
  return compileSassFnc(
    config.sassUtils,
    config.sassBuild,
    'utils.css',
    config.postcssPluginsBase
  );
}

function lintCss(done) {
  lintCssFnc(config.sassAll);
  //console.log("\n\n");
  //lintCssPropsFnc(config.sassAll);
  //console.log("\n\n");
  //lintCssColorsFnc(config.sassAll);
  done();
}

function fixCss(done) {
  fixCssFnc(config.sassCustom, config.sassBase);
  done();
}

function fontLoad(done) {
  fontLoadFnc(
    config.fontloadFile,
    config.buildBase,
    config.fontLoadConfig,
    () => {
      done();
    }
  );
}

function watchFiles() {
  gulp.watch(
    config.sassCustom,
    gulp.series(compileSassCustom, hotReload.browserSyncReload)
  );
  gulp.watch(
    config.sassCore,
    gulp.series(compileSassCore, hotReload.browserSyncReload)
  );
  gulp.watch(
    config.sassUtils,
    gulp.series(compileSassUtils, hotReload.browserSyncReload)
  );
  gulp.watch(
    config.tplMain,
    gulp.series(buildHtml, hotReload.browserSyncReload)
  );
  gulp.watch(
    config.tplBlogDetail,
    gulp.series(buildBlogPages, hotReload.browserSyncReload)
  );
  gulp.watch(
    config.blogListTemplate,
    gulp.series(buildBlogList, hotReload.browserSyncReload)
  );
  gulp.watch(
    config.datasetJsonBase,
    gulp.series(buildDataset, buildHtml, hotReload.browserSyncReload)
  );
  gulp.watch(
    `${config.tplMain}/_partials/*.njk`,
    gulp.series(
      buildDataset,
      builBlog,
      buildBlogPages,
      buildBlogList,
      buildHtml,
      hotReload.browserSyncReload
    )
  );
  gulp.watch(
    `config.jsFiles + '/**/*'`,
    gulp.series(concatFiles, buildHtml, hotReload.browserSyncReload)
  );
  gulp.watch(config.gfxBase, gulp.series(images, hotReload.browserSyncReload));
}

// Gulp tasks
// --------------

gulp.task(
  'build:css',
  gulp.parallel(compileSassCore, compileSassCustom, compileSassUtils)
);
gulp.task('dataset', buildDataset);
gulp.task('cssfix', fixCss);
gulp.task('csslint', lintCss);
gulp.task('html', gulp.series(buildDataset, buildHtml));
gulp.task('fonts', fontLoad);
gulp.task('images', images);

gulp.task(
  'serve',
  gulp.series(
    cleanFolders,
    sourceMarkdown,
    buildDataset,
    concatFiles,
    mergeDatasets,
    compileSassCore,
    compileSassCustom,
    compileSassUtils,
    fontLoad,
    buildBlogPages,
    builBlog,
    buildHtml,
    buildBlogList,
    images,
    gulp.parallel(watchFiles, hotReload.browserSync)
  )
);

// Aliases

gulp.task('watch', gulp.series('serve'));
gulp.task('default', gulp.series('serve'));
