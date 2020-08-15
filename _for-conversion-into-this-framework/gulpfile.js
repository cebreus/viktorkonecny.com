//*********** IMPORTS *****************
var gulp = require('gulp'),
    browserSync = require('browser-sync');
var postcss = require('gulp-postcss');
//var less = require('gulp-less');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat-css');
var cssmin = require('gulp-cssmin');
var concatJs = require('gulp-concat');
var uglify = require('gulp-uglify');


/* BROWSERSYNC */
gulp.task('browserSync', function () {
    var files = ['files/**'];
     
	browserSync.init(files, {  
	    server: {
	       baseDir: 'files/',
	       index: 'index.html'
	    },
	   logPrefix: 'VKT01', 
	   browser: ['firefox']
	});
});

gulp.task('css', function () {
    var processors = [
        autoprefixer
    ];
    return gulp.src('./files/sass/index-files.scss')
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(gulp.dest('./files/css/'))
        //.pipe(livereload());
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./files/sass/*.scss', ['css']);
  gulp.watch('./files/css/*.css', ['concatMinify']);
  //gulp.watch('./files/js/*.js', ['concatMinifyJs']);
});

gulp.task('concatMinify', function () {
  return gulp.src('./files/css/*.css')
    .pipe(concat("index.css"))
    .pipe(cssmin())
    .pipe(gulp.dest('./files/css/compiled'))
    .pipe(livereload());
});

gulp.task('default', ['browserSync', 'watch', 'css', 'concatMinify']);