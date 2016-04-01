var gulp            = require('gulp'),
    svgmin          = require('gulp-svgmin'),
    gutil           = require('gulp-util'),
    svg2png         = require('gulp-svg2png'),
    svgSprite       = require('gulp-svg-sprite'),
    config          = require('../config'),
    handleErrors    = require('../util/handleErrors'),
    browserSync     = require('browser-sync'),
    svgstore        = require('gulp-svgstore'),
    inject          = require('gulp-inject'),
    runSequence     = require('run-sequence').use(gulp),
    html2jade       = require('gulp-html2jade'),
    path            = require('path'),
    gulpif          = require('gulp-if'),
    rename          = require('gulp-rename'),
    svgSymbols      = require('gulp-svg-symbols');

gulp.task('svgSprite', function () {

    return gulp.src(config.svg.src)
        .pipe(svgmin())
        .pipe(svgSprite({
            "mode": {
                "css": {
                    "spacing": {
                        "padding": 0
                    },
                    "dest": "./",
                    "layout": "diagonal",
                    "sprite": config.svg.sprite,
                    "bust": false,
                    "render": {
                        "scss": {
                            "dest": config.svg.css,
                            "template": config.svg.template
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest(config.svg.dest));

});

gulp.task('pngSprite', ['svgSprite'], function() {
    return gulp.src(config.svg.src)
        .pipe(svg2png())
        .on('error', handleErrors)
        .pipe(gulp.dest(config.svg.pngs));
});



gulp.task('svg-assets', function() {
    return gulp.src(config.svg.assets)
        .pipe(svgmin())
        .on('error', handleErrors)
        .pipe(gulp.dest(config.svg.dest));
});

// svg2png, svg sprite, png sprite
//gulp.task('sprites', ['pngSprite', 'svgSprite', 'sprite']);

gulp.task('sprite', function(cb) {
    runSequence('svgSprite',['pngSprite'], 'png-sprite', cb)
});


gulp.task('html-jade', function() {

    var options = {
        nspaces:2, 
        bodyless: true
    };

    return gulp.src(config.svgStore.dest + config.svgStore.fileName)
        .pipe(html2jade(options))
        .pipe(gulp.dest(config.svgStore.jadeDest));
})

gulp.task('build-svgstore', function () {
    var svgs = gulp
        .src(config.svgStore.src)
        .pipe(svgmin())
        .pipe(svgstore({ inlineSvg: true }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src(config.svgStore.file)
        .pipe(inject(svgs, { transform: fileContents }))
        .on('error', handleErrors)
        .pipe(gulp.dest(config.svgStore.dest));
});




gulp.task('symbolsSCSS', function () {
  return gulp.src(config.svgSymbols.src)
  // .pipe(rename(renameFunction))
  .pipe(svgSymbols({
    svgId:      'icon--%f',
    className:  '.icon--%f',
    name: '%f',
    title:      false,
    fontSize:   0,
    templates: ['default-svg', config.svgSymbols.iconTemplate, 'default-demo']
  }))
  .pipe(gulp.dest(config.svgSymbols.cssPath));
});


gulp.task('symbolsSVG', function () {
  return gulp.src(config.svgSymbols.src)
  // .pipe(rename(renameFunction))
  .pipe(svgSymbols({
    svgId:      'icon--%f',
    className:  '.icon--%f',
    title:      false,
    fontSize:   0,
    templates: ['default-svg', config.svgSymbols.iconTemplate, 'default-demo']
  }))

    .pipe(gulpif( /[.]svg$/, gulp.dest(config.svgSymbols.dest)))
});


gulp.task('symbols', function(cb) {
    runSequence('symbolsSVG', ['symbolsSCSS'],  cb)
});

gulp.task('svgstore', function(cb) {
    runSequence('build-svgstore',['html-jade'],  cb)
});


