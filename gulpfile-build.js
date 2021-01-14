const fs = require('fs');
const gulp = require('gulp');
const path = require('path');

const htmlBuildlFnc = require('./gulp-tasks-build/gulp-html-build');

const cleanFnc = require('./gulp-tasks/gulp-clean');
const compileSassFnc = require('./gulp-tasks-build/gulp-compile-sass');
const copyStaticFnc = require('./gulp-tasks/gulp-copy-static');
const createPathsFnc = require('./gulp-tasks/gulp-create-path');
const datasetBuildFnc = require('./gulp-tasks/gulp-dataset-build');
const datasetPrepareFnc = require('./gulp-tasks/gulp-dataset-prepare');
const faviconsFnc = require('./gulp-tasks/gulp-favicons');
const fontLoadFnc = require('./gulp-tasks/gulp-font-load');
const optimizeImagesFnc = require('./gulp-tasks/gulp-optimize-images');

const processJsFnc = require('./gulp-tasks-build/gulp-process-js');
const purgeCssFnc = require('./gulp-tasks-build/gulp-purgecss');
const htmlValidateFnc = require('./gulp-tasks/gulp-html-validate');

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

function htmlValidate() {
  return htmlValidateFnc(`${config.buildBase}/**/*.html`);
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
    datasetPrepareFnc(`${config.contentBase}/site.md`, config.tempBase, () => {
      done();
    });
  });
}

function datasetPreparePages(done) {
  sleep().then(() => {
    datasetPrepareFnc(
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
    datasetPrepareFnc(config.datasetBlogSource, config.datasetBlogBuild, () => {
      done();
    });
  });
}

function datasetPrepareBlogDataset(done) {
  sleep().then(() => {
    datasetBuildFnc(
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

  sleep().then(() => {
    htmlBuildlFnc(params);
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
        htmlBuildlFnc(params);
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
        // Move `favicon.ico` to project root
        fs.rename(
          `${config.faviconBuild}/favicon.ico`,
          `${config.buildBase}/favicon.ico`,
          function (err) {
            if (err) throw err;
          }
        );

        // Move `favicons.njk` and replace in file
        fs.readFile(
          `${config.faviconBuild}/favicons.njk`,
          'utf-8',
          function (err, data) {
            if (err) throw err;

            // Remove link to moved `favicon.ico`
            let newValue = data.replace(/<link rel="shortcut icon[^>]*>/g, '');

            fs.writeFile(
              `${config.tplTemplatesBase}/partials/favicons.njk`,
              newValue,
              'utf-8',
              function (err, data) {
                if (err) throw err;
                // console.log('Done!');
              }
            );
          }
        );
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
          `${config.tempBase}/assets/font/**/*`,
          `${config.tempBase}/assets/font`,
          `${config.buildBase}/assets/font`,
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

gulp.task('validate', htmlValidate);

gulp.task(
  'build',
  gulp.series(
    cleanFolders,
    copyStatic,
    datasetPrepareSite,
    datasetPreparePages,
    datasetPrepareBlogPosts,
    datasetPrepareBlogPosts,
    createPathForBlogPosts,
    datasetPrepareBlogDataset,
    fontLoad,
    compileSassAll,
    processJs,
    favicons,
    buildPages,
    buildBlogPosts,
    purgecss,
    revision,
    replaceHash,
    images,
    cleanFolderTemp
  )
);

// Aliases

gulp.task('default', gulp.series('build'));
