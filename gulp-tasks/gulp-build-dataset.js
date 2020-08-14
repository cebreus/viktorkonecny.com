const fs = require('fs');
const gulp = require('gulp');
const data = require('gulp-data');
const mergeJson = require('gulp-merge-json');
const path = require('path');
const plumber = require('gulp-plumber');

/**
 * @description Merge JSON files into one; each file in new node
 * @param {string,object} input Path with filter to source files
 * @param {string} output Path to save processed files
 * @param {string} outputFilename Output file name
 * @return {stream} Processed file
 */

const buildDataset = (input, output, outputFilename, cb) => {
  return gulp
    .src(input)
    .pipe(
      mergeJson({
        fileName: outputFilename,
        concatArrays: true,
        mergeArrays: false,
        edit: (json, file) => {
          let filename = path.basename(file.path),
            primaryKey = filename.replace(path.extname(filename), '');

          let data = {};
          if (file.path.includes('blog')) {
            if (!file.path.includes('index')) {
              json['path'] = `/blog/${primaryKey}/`;
              data['BLOG'] = [json];
              data['BLOG'] = data['BLOG'].sort(
                (a, b) =>
                  new Date(b['entity_status'].date) -
                  new Date(a['entity_status'].date)
              );
            } else {
              data['BLOGLIST'] = json;
            }
          } else if (primaryKey === 'dataset') {
            data = json;
          } else {
            data[primaryKey.toUpperCase()] = json;
          }
          return data;
        },
      })
    )
    .pipe(gulp.dest(output))
    .on('end', cb);
};

module.exports = buildDataset;
