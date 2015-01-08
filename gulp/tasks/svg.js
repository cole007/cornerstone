var gulp                = require('gulp');
var svgo           		= require('gulp-svgo');
var gutil 				= require('gulp-util');
var svg2png				= require('gulp-svg2png');
var svgSprites          = require('gulp-svg-sprites');
var config				= require('../config').svg;
var handleErrors 		= require('../util/handleErrors');
var browserSync 		= require('browser-sync');

var basePaths = {
	src: './build/',
	dest: './html/assets/',
};
var paths = {
	images: {
		src: basePaths.src + 'img/',
		dest: basePaths.dest + 'img/'
	},
	sprite: {
		src: basePaths.src + 'sprite/*',
		svg: 'img/sprite.svg',
		css: '../../' + basePaths.src + 'sass/src/_sprite.scss'
	},
	templates: {
		src: basePaths.src + 'tpl/'
	}
};

/*
	Let the magic begin
*/



var changeEvent = function(evt) {
	gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

gulp.task('svgSprite', function () {

	return gulp.src(paths.sprite.src)
		.pipe(svgo())
		.pipe(svgSprites({
			cssFile: paths.sprite.css,
			preview: false,
			layout: 'diagonal',
			padding: 5,
			svg: {
				sprite: paths.sprite.svg
			},
			templates: {
				css: require("fs").readFileSync(paths.templates.src + 'sprite-template.scss', "utf-8")
			}
		}))
		.pipe(gulp.dest(basePaths.dest));

});



// gulp.task('pngSprite', ['svgSprite'], function() {
// 	return gulp.src(basePaths.dest + paths.sprite.svg)
// 		.pipe(svg2png())
// 		.pipe(gulp.dest(paths.images.dest));
// });

// gulp.task('sprite', ['pngSprite']);

// gulp.task('watch', function(){
// 	gulp.watch(paths.sprite.src, ['sprite']).on('change', function(evt) {
// 		changeEvent(evt);
// 	});
// });

// gulp.task('default', ['sprite']);
