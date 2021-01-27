const fs = require('fs');
const gulp = require('gulp');
const data = require('gulp-data');
const mergeJson = require('gulp-merge-json');
const path = require('path');
const through = require('through2');

/**
 * @description Merge JSON files into one; each file in new node
 * @param {string, object} input Path with filter to source files
 * @param {string} output Path to save processed files
 * @param {string} outputFilename Output file name
 * @return {stream} Processed file
 */

const datasetBuild = (input, output, outputFilename, cb) => {
  return (
    gulp
      .src(input)
      .pipe(
        mergeJson({
          fileName: outputFilename,
          concatArrays: true,
          mergeArrays: false,
          edit: (json, file) => {
            let data = {};
            let fileName = path.parse(file.path).name;
            let fileDir = path.parse(file.path).dir;

            // site data
            if (fileName === 'site') {
              let primaryKey = fileName;
              data[primaryKey.toUpperCase()] = json;
            }
            // datasets e.g. Blog posts
            else if (fileDir.includes('dataset-')) {
              let primaryKey = fileDir
                .split(path.sep)
                .pop()
                .replace('_dataset-', '');
              data[primaryKey.toUpperCase()] = [json];
            }
            return data;
          },
        })
      )
      // Sorting BLOG by `entity_status.date`
      .pipe(
        through.obj((chunk, enc, cb) => {
          let file = JSON.parse(chunk.contents.toString('utf-8'));

          file['BLOG'] = file['BLOG'].sort(
            (a, b) =>
              new Date(b.entity_status['date']) -
              new Date(a.entity_status['date'])
          );

          const fileString = JSON.stringify(file);
          const fileBuffer = Buffer.from(fileString, 'utf-8');

          chunk.contents = fileBuffer;

          cb(null, chunk);
        })
      )
      .pipe(gulp.dest(output))
      .on('end', cb)
  );
};

module.exports = datasetBuild;
