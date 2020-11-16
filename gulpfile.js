const fs = require('fs');
const gulp = require('gulp');
const path = require('path');

const buildDatasetFnc = require('./gulp-tasks/gulp-build-dataset');
const buildHtmlFnc = require('./gulp-tasks/gulp-build-html');
const cleanFnc = require('./gulp-tasks/gulp-clean');
const compileSassFnc = require('./gulp-tasks/gulp-compile-sass');
const copyStaticFnc = require('./gulp-tasks/gulp-copy-static');
const concatJsFnc = require('./gulp-tasks/gulp-concat-files');
const loadFontFnc = require('./gulp-tasks/gulp-font-load');
const optimizeImagesFnc = require('./gulp-tasks/gulp-optimize-images');
const prepareDatasetFnc = require('./gulp-tasks/gulp-dataset-prepare');
const hotReload = require('./gulp-tasks/gulp-hotreload');

// Variables
// --------------

const config = require('./gulpconfig');

// Gulp functions
// --------------

function cleanFolders() {
  return cleanFnc(config.buildBase);
}

function copyStatic(done) {
  return copyStaticFnc('./static/**/*', './static', config.buildBase, () => {
    done();
  });
}

// SASS

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

// JS

function concatJs() {
  return concatJsFnc(config.jsFiles, config.jsBuild, 'app.js');
}

// Dataset

function datasetPrepareSite(done) {
  prepareDatasetFnc(`${config.contentBase}/site.md`, config.tempBase, () => {
    done();
  });
}

function datasetPreparePages(done) {
  prepareDatasetFnc(config.datasetPagesSource, config.datasetPagesBuild, () => {
    done();
  });
}

function datasetPrepareBlogPosts(done) {
  prepareDatasetFnc(config.datasetBlogSource, config.datasetBlogBuild, () => {
    done();
  });
}

function datasetPrepareBlogDataset(done) {
  buildDatasetFnc(
    [`${config.tempBase}/site.json`, `${config.datasetBlogBuild}/*.json`],
    config.tempBase,
    config.datasetBlog,
    () => {
      done();
    }
  );
  done();
}

// Templates

function buildPages(done) {
  const params = {
    input: `${config.tplPagesBase}/**/*.html`,
    output: config.tplBuild,
    templates: config.tplTemplatesBase,
    processPaths: [config.tplPagesBase, config.tplTemplatesBase],
    siteConfig: `${config.tempBase}/site.json`,
    datasetBlog: `${config.tempBase}/${config.datasetBlog}`,
    dataSource: config.datasetPagesBuild,
    injectCdnJs: config.injectCdnJs,
    injectJs: config.injectJs,
    injectCss: config.injectCss,
    injectIgnorePath: config.buildBase.replace('./', ''),
    cb: () => {
      done();
    },
  };
  buildHtmlFnc(params);
}

function buildBlogPosts(done) {
  fs.readdir(config.datasetBlogBuild, (err, files) => {
    files.forEach((file) => {
      let fileName = path.parse(file).name;

      const params = {
        input: config.tplBlogPost,
        output: `${config.blogBuild}/${fileName}`,
        templates: config.tplTemplatesBase,
        processPaths: [config.tplPagesBase, config.tplTemplatesBase],
        siteConfig: `${config.tempBase}/site.json`,
        datasetBlog: `${config.tempBase}/${config.datasetBlog}`,
        dataSource: `${config.datasetBlogBuild}/${file}`,
        injectCdnJs: config.injectCdnJs,
        injectJs: config.injectJs,
        injectCss: config.injectCss,
        injectIgnorePath: config.buildBase.replace('./', ''),
        rename: 'index',
        cb: () => {
          done();
        },
      };
      buildHtmlFnc(params);
    });
  });
  done();
}

// GFX

function images(done) {
  optimizeImagesFnc.optimizeJpg(config.imagesJpg, config.gfxBuild, {
    rewriteExisting: true,
  });
  optimizeImagesFnc.optimizePng(config.imagesPng, config.gfxBuild, {
    rewriteExisting: true,
  });
  optimizeImagesFnc.optimizeSvg(config.imagesSvg, config.gfxBuild, {
    rewriteExisting: true,
  });
  done();
}

// Fonts

function fontLoad(done) {
  loadFontFnc(
    config.fontloadFile,
    config.tempBase,
    config.fontLoadConfig,
    () => {
      done();
    }
  );
}

// Watch
// --------------

function watchFiles() {
  // Watch SASS

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

  // Watch JS

  gulp.watch(
    config.jsFiles,
    gulp.series(concatJs, hotReload.browserSyncReload)
  );

  // Watch Templates

  gulp.watch(
    ['./src/templates/**/*.*', './src/pages/**/*.*'],
    gulp.series(buildPages, buildBlogPosts, hotReload.browserSyncReload)
  );

  gulp.watch(
    config.tplBlogPost,
    gulp.series(buildBlogPosts, hotReload.browserSyncReload)
  );

  // Watch Datasets
  // FIXME: způsobuje pád

  // gulp.watch(
  //   //config.datasetSourceMd,
  //   './content/**/*.md',
  //   gulp.series(
  //     datasetPrepareSite,
  //     datasetPreparePages,
  //     datasetPrepareblog,
  //     datasetPrepareBlogPaginate,
  //     datasetBuildBlog,
  //     buildBlogPosts,
  //     buildPages,
  //     hotReload.browserSyncReload
  //   )
  // );

  // Watch GFX

  gulp.watch(config.gfxBase, gulp.series(images, hotReload.browserSyncReload));
}

// Gulp tasks
// --------------

gulp.task(
  'css',
  gulp.parallel(compileSassCore, compileSassCustom, compileSassUtils)
);

gulp.task('js', concatJs);

gulp.task(
  'dataset',
  gulp.parallel(
    datasetPrepareSite,
    datasetPreparePages,
    datasetPrepareBlogPosts,
    datasetPrepareBlogDataset
  )
);

gulp.task(
  'html',
  gulp.series(
    datasetPrepareSite,
    datasetPreparePages,
    datasetPrepareBlogPosts,
    datasetPrepareBlogDataset,
    buildPages,
    buildBlogPosts
  )
);

gulp.task('images', images);

gulp.task('fonts', fontLoad);

gulp.task(
  'serve',
  gulp.series(
    cleanFolders,
    datasetPrepareSite,
    datasetPreparePages,
    datasetPrepareBlogPosts,
    datasetPrepareBlogDataset,
    fontLoad,
    compileSassCore,
    compileSassCustom,
    compileSassUtils,
    concatJs,
    buildPages,
    buildBlogPosts,
    images,
    copyStatic,
    gulp.parallel(watchFiles, hotReload.browserSync)
  )
);

// Aliases

gulp.task('watch', gulp.series('serve'));
gulp.task('default', gulp.series('serve'));
