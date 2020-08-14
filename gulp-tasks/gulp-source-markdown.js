const gulp = require('gulp');
const plumber = require('gulp-plumber');
const markdownToJSON = require('gulp-markdown-to-json');
const marked = require('marked');

const sourceMarkdown = (input, output, cb) => {
  return gulp
    .src(input)
    .pipe(plumber())
    .pipe(markdownToJSON(marked))
    .pipe(gulp.dest(output))
    .on('end', cb);
};

module.exports = sourceMarkdown;
