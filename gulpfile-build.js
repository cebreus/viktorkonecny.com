const fs = require('fs');
const gulp = require('gulp');
const path = require('path');

const buildDatasetFnc = require('./gulp-tasks/gulp-build-dataset');
const buildHtmlFnc = require('./gulp-tasks-build/gulp-build-html');
const cleanFnc = require('./gulp-tasks/gulp-clean');
const compileSassFnc = require('./gulp-tasks-build/gulp-compile-sass');
const copyStaticFnc = require('./gulp-tasks/gulp-copy-static');
const faviconsFnc = require('./gulp-tasks/gulp-favicons');
const fontLoadFnc = require('./gulp-tasks/gulp-font-load');
const optimizeImagesFnc = require('./gulp-tasks/gulp-optimize-images');
const prepareDatasetFnc = require('./gulp-tasks/gulp-dataset-prepare');
const processJsFnc = require('./gulp-tasks-build/gulp-process-js');
const purgeCssFnc = require('./gulp-tasks-build/gulp-purgecss');

const replaceHashFnc = require('./gulp-tasks-build/gulp-sri-hash');
const revisionFnc = require('./gulp-tasks-build/gulp-revision');

// Variables
// --------------

const config = require('./gulpconfig-build');

const sleep = (waitTimeInMs = 0) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

// Gulp functions
// --------------

function cleanFolders() {
  return cleanFnc([config.tempBase, config.buildBase]);
}

function cleanFolderTemp() {
  return cleanFnc(config.tempBase);
}

function copyStatic(done) {
  sleep().then(() => {
    return copyStaticFnc('./static/**/*', './static', config.buildBase, () => {
      done();
    });
  });
}

// SASS

function compileSassAll() {
  return compileSassFnc(
    config.sassAll,
    config.sassBuild,
    'index.min.css',
    config.postcssPluginsBase
  );
}

function purgecss(done) {
  sleep().then(() => {
    return purgeCssFnc(
      [`${config.buildBase}/**/*.css`],
      [`${config.buildBase}/**/*.html`],
      config.buildBase,
      () => {
        done();
      }
    );
  });
}

// JS

function processJs() {
  return processJsFnc(config.jsFiles, config.jsBuild, {
    concatFiles: true,
    outputConcatPrefixFileName: 'app',
  });
}

// Dataset

function datasetPrepareSite(done) {
  sleep().then(() => {
    prepareDatasetFnc(`${config.contentBase}/site.md`, config.tempBase, () => {
      done();
    });
  });
}

function datasetPreparePages(done) {
  sleep().then(() => {
    prepareDatasetFnc(
      config.datasetPagesSource,
      config.datasetPagesBuild,
      () => {
        done();
      }
    );
  });
}

function datasetPrepareBlogPosts(done) {
  sleep().then(() => {
    prepareDatasetFnc(config.datasetBlogSource, config.datasetBlogBuild, () => {
      done();
    });
  });
}

function datasetPrepareBlogDataset(done) {
  sleep().then(() => {
    buildDatasetFnc(
      [`${config.tempBase}/site.json`, `${config.datasetBlogBuild}/*.json`],
      config.tempBase,
      config.datasetBlog,
      () => {
        done();
      }
    );
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

  sleep().then(() => {
    buildHtmlFnc(params);
  });
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

      sleep().then(() => {
        buildHtmlFnc(params);
      });
    });
  });
}

// GFX

function images(done) {
  sleep().then(() => {
    optimizeImagesFnc.optimizeJpg(config.imagesJpg, config.gfxBuild);
  });
  sleep().then(() => {
    optimizeImagesFnc.optimizePng(config.imagesPng, config.gfxBuild);
  });
  sleep().then(() => {
    optimizeImagesFnc.optimizeSvg(config.imagesSvg, config.gfxBuild);
  });
  done();
}

// Favicons

function favicons(done) {
  sleep().then(() => {
    return faviconsFnc(
      config.faviconSourceFile,
      config.faviconBuild,
      config.faviconGenConfig,
      () => {
        fs.rename(
          `${config.faviconBuild}/favicon.ico`,
          `${config.buildBase}/favicon.ico`,
          function (err) {
            if (err) throw err;
          }
        );
        fs.unlinkSync(`${config.faviconBuild}/favicons.njk`);
      }
    );
  });
  done();
}

// Fonts

function fontLoad(done) {
  sleep().then(() => {
    fontLoadFnc(
      config.fontloadFile,
      config.tempBase,
      config.fontLoadConfig,
      () => {
        copyStaticFnc(
          `${config.tempBase}/font/**/*`,
          `${config.tempBase}/font`,
          `${config.buildBase}/font`,
          () => {
            done();
          }
        );
      }
    );
  });
}

function replaceHash(done) {
  sleep().then(() => {
    return replaceHashFnc(
      `${config.buildBase}/**/*.html`,
      config.buildBase,
      () => {
        done();
      }
    );
  });
}

function revision(done) {
  const params = {
    inputRevision: [
      `${config.buildBase}/**/*.css`,
      `${config.buildBase}/**/*.js`,
    ],
    inputRewrite: `${config.buildBase}/**/*.html`,
    outputRevision: config.buildBase,
    outputRewrite: config.buildBase,
    ouputManifest: `${config.tempBase}/revision`,
    cb: () => {
      done();
    },
  };

  sleep().then(() => {
    return revisionFnc(params);
  });
}

// Gulp tasks
// --------------

gulp.task('css', compileSassAll);

gulp.task('js', processJs);

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
  'build',
  gulp.series(
    cleanFolders,
    datasetPrepareSite,
    datasetPreparePages,
    datasetPrepareBlogPosts,
    datasetPrepareBlogDataset,
    fontLoad,
    compileSassAll,
    processJs,
    favicons,
    buildPages,
    buildBlogPosts,
    purgecss,
    copyStatic,
    revision,
    replaceHash,
    images,
    cleanFolderTemp
  )
);

// Aliases

gulp.task('default', gulp.series('build'));
