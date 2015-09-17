/*
 * build
 * move all src files to dist directory
 */
 
var gulp                = require('gulp'),
    runSequence         = require('run-sequence'),
    uglify              = require('gulp-uglify'),
    concat              = require('gulp-concat'),
    handleErrors        = require('../util/handleErrors'),
    cssmin              = require('gulp-minify-css'),
    config              = require('../config').build,
    scripts             = require('../config').scripts;
 

 
// gulp.task('o-css', function(callback) {
//   runSequence('sass', 'cssmin', callback);
// });
 
 
 
// move the html files to dist
gulp.task('build-html', function(callback) {
    gulp.src(config.html_src)
      .pipe(gulp.dest(config.html_dest));
});
 
// move the fonts to dist
gulp.task('build-fonts', function(callback) {
    gulp.src(config.fonts_src)
      .pipe(gulp.dest(config.fonts_dest));
});
 
// move images to dist
gulp.task('build-images', function(callback) {
    gulp.src(config.images_src)
      .pipe(gulp.dest(config.images_dest));
});
 
// move and optimise the scripts
gulp.task('build-scripts', function(callback) {
    gulp.src(scripts.src)
        .pipe(uglify())
        .on('error', handleErrors)
        .pipe(concat(scripts.output))
        .pipe(gulp.dest(config.js_MergeDest));
});
 
// move any scripts which are not merged in to app.js
// for example modernizer 
gulp.task('move-scripts', function(callback) {
    gulp.src(config.js_src)
      .pipe(gulp.dest(config.js_dest));
});
 
// optimise the css and move to the dist folder
gulp.task('build-css', function(callback) {
    gulp.src(config.css_src)
        //https://github.com/jakubpawlowicz/clean-css
        .pipe(cssmin())
        .pipe(gulp.dest(config.css_dest));
});
 
// optimise the css and move to the dist folder
// gulp.task('build-js-temps', function(callback) {
//     gulp.src(config.js_temp_source)
//         .pipe(gulp.dest(config.js_temp_dest));
// });
 
// run all the build tasks
gulp.task('build', function(callback) {
  runSequence(['build-fonts', 'build-images', 'build-scripts', 'move-scripts', 'build-css'], callback);
});