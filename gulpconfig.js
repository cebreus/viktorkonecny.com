const autoprefixer = require('autoprefixer');
const flexbugsFixes = require('postcss-flexbugs-fixes');

// Paths
// --------------

const devBase = './src';
const buildBase = './temp';
const tempBase = './temp';
const cmsBase = './content';

// SASS
// --------------

const sassBase = `${devBase}/scss`;
const sassBuild = `${buildBase}/css`;
const sassAll = [
  `${sassBase}/*.scss`,
  `!${sassBase}/_*.scss`,
  `!${sassBase}/u-*.scss`,
];

const sassCustom = [
  `${sassBase}/custom.scss`,
  `${sassBase}/c-*.scss`,
  `${sassBase}/_variables.scss`,
];
const sassCore = [`${sassBase}/bootstrap.scss`, `${sassBase}/_variables.scss`];
const sassUtils = [`${sassBase}/u-*.scss`, `${sassBase}/_variables.scss`];
const injectCss = `${sassBuild}/*.css`;

// Data JSON
// --------------

const datasetJsonBase = `${devBase}/data/**/*.json`;
const datasetJsonFileName = 'dataset.json';
const datasetJsonBuild = tempBase;

const datasetJsonWBlog = `${tempBase}/**/*.json`;

// Markdown sources
// ----------------

const sourceMarkdownBase = `${cmsBase}/**/*.md`;
const sourceMarkdownBuild = tempBase;

// Templates
// --------------

const tplBase = `${devBase}/pages`;
const tplMain = [
  `${tplBase}/**/*.html`,
  `!${tplBase}/*/blog-detail.html`,
  `!${tplBase}/*/blog-index.html`,
];
const tplBuild = `${buildBase}`;
const tplBuildBlog = `${buildBase}/blog`;
const tplDataset = `${tempBase}/dataset.json`;
const tplBlogDatasetFolder = `${tempBase}/blog/`;
const tplBlogDetail = `${tplBase}/*/blog-detail.html`;

const blogDatasetFolder = `${tempBase}/blog-data`;
const blogListTemplate = `${tplBase}/*/blog-index.html`;

// GFX
// --------------

const gfxBase = `${devBase}/gfx`;
const gfxBuild = `${buildBase}/images`;

const svgBase = `${gfxBase}/**`;
const svgImages = [`${svgBase}/*.svg`, `!${devBase}/favicon/**/*.*`];

const jpgBase = `${gfxBase}/**`;
const jpgImages = [`${jpgBase}/*.jpg`, `!${devBase}/favicon/**/*.*`];

const pngBase = `${gfxBase}/**`;
const pngImages = [`${pngBase}/*.png`, `!${pngBase}/favicon/**/*.*`];

// JavaScript
// --------------

const jsBase = `${devBase}/js`;
const jsFiles = `${jsBase}/*.js`;
const jsBuild = `${buildBase}/js`;
const injectJs = `${jsBuild}/*.js`;

const injectCdnJs = [
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.1/umd/popper.min.js" integrity="sha512-ubuT8Z88WxezgSqf3RLuNi5lmjstiJcyezx34yIU2gAHonIi27Na7atqzUZCOoY4CExaoFumzOsFQ2Ch+I/HCw==" crossorigin="anonymous"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/js/bootstrap.min.js" integrity="sha512-8qmis31OQi6hIRgvkht0s6mCOittjMa9GMqtK9hes5iEQBQE/Ca6yGE5FsW36vyipGoWQswBj/QBm2JR086Rkw==" crossorigin="anonymous"></script>',
];

// Modules & Plugins
// --------------

const postcssPluginsBase = [
  flexbugsFixes,
  autoprefixer({
    grid: true,
  }),
];

const fontloadFile = `${devBase}/fonts.list`;
const fontLoadConfig = {
  fontsDir: 'font/',
  cssDir: 'css/',
  cssFilename: 'fonts.css',
  relativePaths: true,
};
module.exports = {
  devBase: devBase,
  buildBase: buildBase,
  tempBase: tempBase,
  sassBase: sassBase,
  sassBuild: sassBuild,
  sassAll: sassAll,
  sassCustom: sassCustom,
  sassCore: sassCore,
  sassUtils: sassUtils,
  postcssPluginsBase: postcssPluginsBase,
  injectCss: injectCss,
  datasetJsonBase: datasetJsonBase,
  datasetJsonBuild: datasetJsonBuild,
  datasetJsonFileName: datasetJsonFileName,
  datasetJsonWBlog: datasetJsonWBlog,
  sourceMarkdownBase: sourceMarkdownBase,
  sourceMarkdownBuild: sourceMarkdownBuild,
  tplBase: tplBase,
  tplMain: tplMain,
  tplBuild: tplBuild,
  tplBuildBlog: tplBuildBlog,
  blogDatasetFolder: blogDatasetFolder,
  blogListTemplate: blogListTemplate,
  tplDataset: tplDataset,
  tplBlogDataset: tplDataset,
  tplBlogDatasetFolder: tplBlogDatasetFolder,
  tplBlogDetail: tplBlogDetail,

  injectCdnJs: injectCdnJs,
  jsFiles: jsFiles,
  jsBuild: jsBuild,
  injectJs: injectJs,
  gfxBase: gfxBase,
  gfxBuild: gfxBuild,
  svgImages: svgImages,
  jpgImages: jpgImages,
  pngImages: pngImages,
  fontloadFile: fontloadFile,
  fontLoadConfig: fontLoadConfig,
};
