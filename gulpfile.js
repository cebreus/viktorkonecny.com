const fs = require('fs');
const gulp = require('gulp');
const path = require('path');

const cleanFnc = require('./gulp-tasks/gulp-clean');
const compileSassFnc = require('./gulp-tasks/gulp-compile-sass');
const concatJsFnc = require('./gulp-tasks/gulp-concat-files');
const copyStaticFnc = require('./gulp-tasks/gulp-copy-static');
const createPathsFnc = require('./gulp-tasks/gulp-create-path');
const datasetBuildFnc = require('./gulp-tasks/gulp-dataset-build');
const datasetPrepareFnc = require('./gulp-tasks/gulp-dataset-prepare');
const fontLoadFnc = require('./gulp-tasks/gulp-font-load');
const hotReload = require('./gulp-tasks/gulp-hotreload');
const htmlBuildlFnc = require('./gulp-tasks/gulp-html-build');
const optimizeImagesFnc = require('./gulp-tasks/gulp-optimize-images');

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
  datasetPrepareFnc(`${config.contentBase}/site.md`, config.tempBase, () => {
    done();
  });
}

function datasetPreparePages(done) {
  datasetPrepareFnc(config.datasetPagesSource, config.datasetPagesBuild, () => {
    done();
  });
}

function datasetPrepareBlogPosts(done) {
  datasetPrepareFnc(config.datasetBlogSource, config.datasetBlogBuild, () => {
    done();
  });
}

function datasetPrepareBlogDataset(done) {
  datasetBuildFnc(
    [`${config.tempBase}/site.json`, `${config.datasetBlogBuild}/*.json`],
    config.tempBase,
    config.datasetBlog,
    () => {
      done();
    }
  );
  done();
}

function createPathForBlogPosts(done) {
  createPathsFnc(config.datasetBlogBuild, () => {
    done();
  });
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
  htmlBuildlFnc(params);
}

function buildBlogPosts(done) {
  fs.readdir(config.datasetBlogBuild, (err, files) => {
    files.forEach((file) => {
      const fileName = path.parse(file).name.replace(/\\/g, '/');

      // read current file
      const readFile = fs.readFileSync(
        `${config.datasetBlogBuild}/${file}`,
        'utf8'
      );

      // parse current file
      const parsedFile = JSON.parse(readFile);

      // if seo.slug exists use it as the output pah else use the current filename
      const outputPath = parsedFile.seo.slug || fileName;

      const params = {
        input: config.tplBlogPost,
        output: `${config.blogBuild}/${outputPath}`,
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
      htmlBuildlFnc(params);
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
  fontLoadFnc(
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
    gulp.series(compileSassCustom, hotReload.browserSyncRefresh)
  );

  gulp.watch(
    config.sassCore,
    gulp.series(compileSassCore, hotReload.browserSyncRefresh)
  );

  gulp.watch(
    config.sassUtils,
    gulp.series(compileSassUtils, hotReload.browserSyncRefresh)
  );

  // Watch JS

  gulp.watch(
    config.jsFiles,
    gulp.series(concatJs, hotReload.browserSyncRefresh)
  );

  // Watch Templates

  gulp
    .watch(
      ['./src/templates/**/*.*', './src/pages/**/*.*', config.tplBlogPost],
      gulp.series(buildPages, buildBlogPosts)
    )
    .on('change', hotReload.browserSyncReload);

  // Watch GFX

  gulp.watch(config.gfxBase, gulp.series(images, hotReload.browserSyncRefresh));
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
    copyStatic,
    datasetPrepareSite,
    datasetPreparePages,
    datasetPrepareBlogPosts,
    createPathForBlogPosts,
    datasetPrepareBlogDataset,
    fontLoad,
    compileSassCore,
    compileSassCustom,
    compileSassUtils,
    concatJs,
    buildPages,
    buildBlogPosts,
    images,
    gulp.parallel(watchFiles, hotReload.browserSync)
  )
);

// Aliases

gulp.task('watch', gulp.series('serve'));
gulp.task('default', gulp.series('serve'));
