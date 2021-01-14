const autoprefixer = require('autoprefixer');
const flexbugsFixes = require('postcss-flexbugs-fixes');

// Paths
// --------------

const devBase = './src';
const buildBase = './temp';
const tempBase = './temp';
const contentBase = './content';
const blogBuild = `${buildBase}/blog`;
const blogTemp = `${tempBase}/blog`;

// SASS
// --------------

const sassBase = `${devBase}/scss`;
const sassBuild = `${buildBase}/assets/css`;
const sassAll = [`${sassBase}/*.scss`, `!${sassBase}/_*.scss`];
const sassCustom = [
  `${sassBase}/custom.scss`,
  `${sassBase}/*.scss`,
  `${sassBase}/_variables.scss`,
  `!${sassBase}/u-*.scss`,
  `!${sassBase}/bootstrap.scss`,
];
const sassCore = [`${sassBase}/bootstrap.scss`, `${sassBase}/_variables.scss`];
const sassUtils = [`${sassBase}/u-*.scss`, `${sassBase}/_variables.scss`];
const injectCss = `${sassBuild}/*.css`;

// JavaScript
// --------------

const jsBase = `${devBase}/js`;
const jsFiles = `${jsBase}/*.js`;
const jsBuild = `${buildBase}/assets/js`;
const injectJs = `${jsBuild}/*.js`;

const injectCdnJs = [
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js" integrity="sha512-bLT0Qm9VnAYZDflyKcBaQ2gg0hSYNQrJ8RilYldYQ1FxQYoCLtUjuuRuZo+fjqhx/qtq/1itJ0C2ejDxltZVFg==" crossorigin="anonymous"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.3/js/bootstrap.bundle.min.js" integrity="sha512-iceXjjbmB2rwoX93Ka6HAHP+B76IY1z0o3h+N1PeDtRSsyeetU3/0QKJqGyPJcX63zysNehggFwMC/bi7dvMig==" crossorigin="anonymous"></script>',
  // '<script src="./js/classie.js"></script>',
  // '<script src="./js/scroll.js"></script>',
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
];

const fontloadFile = `${devBase}/fonts.list`;
const fontLoadConfig = {
  fontsDir: 'assets/font/',
  cssDir: 'assets/css/',
  cssFilename: 'fonts.scss',
  relativePaths: true,
  fontDisplayType: 'swap',
};

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
  sassCore,
  sassCustom,
  sassUtils,
  tempBase,
  tplBase,
  tplBlogList,
  tplBlogPost,
  tplBuild,
  tplPagesBase,
  tplTemplatesBase,
};
