import gulp from 'gulp'
import webpack from 'webpack'
import inject from 'gulp-inject'
import {
	logger
} from '../libs/utils'
import webpackConfig from './webpack.config.babel'
import path from 'path'
import uglify from 'gulp-uglify'
import browserSync from 'browser-sync'

export function webpackProduction(callback) {
	const env = global.production ? 'production' : 'development'
	const config = webpackConfig(env)
	webpack(config, function (err, stats) {
		logger(err, stats)
		callback()
	})
}
export function inlineScripts() {
	return gulp.src(`${PATH_CONFIG.inline.path}/${PATH_CONFIG.inline.output}`)
		.pipe(inject(gulp.src(PATH_CONFIG.inline.src).pipe(uglify()), {
			transform: function (filepath, file) {
				return `<script>${file.contents.toString()}</script>`
			}
		}))
		.pipe(gulp.dest(PATH_CONFIG.inline.path))
}

export function serviceWorker() {
	return gulp.src(path.resolve(PATH_CONFIG.src, PATH_CONFIG.serviceWorker.src))
		// .pipe(uglify())
		.pipe(gulp.dest(path.resolve(PATH_CONFIG.dest, PATH_CONFIG.serviceWorker.dest)))
		.pipe(browserSync.stream())
}


gulp.task('serviceWorker', serviceWorker)
gulp.task('inline-scripts', inlineScripts)
gulp.task('bundle-script', webpackProduction)