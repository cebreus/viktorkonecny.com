const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const flexbugsFixes = require('postcss-flexbugs-fixes');

// Paths
// --------------

const devBase = './src';
const buildBase = './build';
const tempBase = './temp';
const contentBase = './content';
const blogBuild = `${buildBase}/blog`;
const blogTemp = `${tempBase}/blog`;

// SASS
// --------------

const sassBase = `${devBase}/scss`;
const sassBuild = `${buildBase}/assets/css`;
const sassAll = [
  `${sassBase}/*.scss`,
  `!${sassBase}/_*.scss`,
  `!${sassBase}/u-*.scss`,
];

const injectCss = `${sassBuild}/*.css`;

// JavaScript
// --------------

const jsBase = `${devBase}/js`;
const jsFiles = `${jsBase}/*.js`;
const jsBuild = `${buildBase}/assets/js`;
const injectJs = `${jsBuild}/*.js`;

const injectCdnJs = [
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.1/umd/popper.min.js" integrity="sha512-ubuT8Z88WxezgSqf3RLuNi5lmjstiJcyezx34yIU2gAHonIi27Na7atqzUZCOoY4CExaoFumzOsFQ2Ch+I/HCw==" crossorigin="anonymous"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/js/bootstrap.min.js" integrity="sha512-8qmis31OQi6hIRgvkht0s6mCOittjMa9GMqtK9hes5iEQBQE/Ca6yGE5FsW36vyipGoWQswBj/QBm2JR086Rkw==" crossorigin="anonymous"></script>',
  //  '<script src="./js/classie.js"></script>',
  //  '<script src="./js/scroll.js"></script>',
];

// Templates
// --------------

const tplBase = `${devBase}/pages`;
const tplBuild = buildBase;

const tplPagesBase = `${devBase}/pages`;
const tplTemplatesBase = `${devBase}/templates`;

const tplBlogList = `${devBase}/pages/blog/index.html`;
const tplBlogPost = `${devBase}/templates/blog-post.html`;

// Datasets from Markdown to JSON
// ----------------

const datasetPagesSource = `${contentBase}/pages/**/*.md`;
const datasetPagesBuild = `${tempBase}/_dataset-pages`;

const datasetBlogSource = `${contentBase}/blog/**/*.md`;
const datasetBlogBuild = `${tempBase}/_dataset-blog`;
const datasetBlog = `_dataset-blog.json`;

// GFX
// --------------

const gfxBase = `${devBase}/gfx`;
const gfxBuild = `${buildBase}/assets/images`;

const svgBase = `${gfxBase}/**`;
const imagesSvg = [`${svgBase}/*.svg`, `!${devBase}/favicon/**/*.*`];

const jpgBase = `${gfxBase}/**`;
const imagesJpg = [`${jpgBase}/*.jpg`, `!${devBase}/favicon/**/*.*`];

const pngBase = `${gfxBase}/**`;
const imagesPng = [`${pngBase}/*.png`, `!${pngBase}/favicon/**/*.*`];

// Modules & Plugins
// --------------

const postcssPluginsBase = [
  flexbugsFixes,
  autoprefixer({
    grid: true,
  }),
  cssnano(),
];

const fontloadFile = `${devBase}/fonts.list`;
const fontLoadConfig = {
  fontsDir: 'assets/font/',
  cssDir: 'assets/css/',
  cssFilename: 'fonts.scss',
  relativePaths: true,
  fontDisplayType: 'swap',
};

const faviconSourceFile = `${gfxBase}/favicon/favicons-source.png`;
const faviconBuild = `${buildBase}/assets/favicons`;
const faviconGenConfig = {
  appName: 'My App',
  appShortName: 'App',
  appDescription: 'This is my application',
  developerName: 'Developer name',
  developerURL: 'https://developerwebsite.com/',
  background: '#000000',
  path: '/assets/favicons/',
  url: 'https://urlofwebsite.com/',
  display: 'standalone',
  orientation: 'portrait',
  scope: '/',
  start_url: '/index.html',
  version: 1.0,
  logging: false,
  html: 'favicons.njk',
  pipeHTML: true,
  replace: false,
  icons: {
    android: false,
    appleIcon: false,
    appleStartup: false,
    coast: false,
    favicons: true,
    firefox: false,
    windows: false,
    yandex: false,
  },
};

// Files that need to be removed
// --------------

const buildRevManifest = `${tempBase}/rev-manifest.json`;

// Exports
// --------------

module.exports = {
  blogBuild,
  blogTemp,
  buildBase,
  contentBase,
  datasetBlog,
  datasetBlogBuild,
  datasetBlogSource,
  datasetPagesBuild,
  datasetPagesSource,
  devBase,
  faviconBuild,
  faviconGenConfig,
  faviconSourceFile,
  fontLoadConfig,
  fontloadFile,
  gfxBase,
  gfxBuild,
  imagesJpg,
  imagesPng,
  imagesSvg,
  injectCdnJs,
  injectCss,
  injectJs,
  jsBuild,
  jsFiles,
  postcssPluginsBase,
  sassAll,
  sassBase,
  sassBuild,
  tempBase,
  tplBase,
  tplBlogList,
  tplBlogPost,
  tplBuild,
  tplPagesBase,
  tplTemplatesBase,
};
