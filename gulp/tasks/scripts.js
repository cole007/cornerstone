/*eslint no-undef: "error"*/

import gulp from 'gulp'
import rollup from 'rollup-stream'
import gulpif from 'gulp-if'
import babel from 'rollup-plugin-babel'
import globals from 'rollup-plugin-node-globals'
import eslint from 'rollup-plugin-eslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import config from '../config'
import source from 'vinyl-source-stream'
import handleErrors from '../util/handleErrors'
import rename from 'gulp-rename'

const $js = config.js

let cache

gulp.task('scripts', () => {
	return rollup({
		entry: $js.src,
		dest: `${$js.dest}/${$js.output}`,
		format: 'iife',
		sourceMap: (process.env.NODE_ENV !== 'production' && 'inline'),
		cache: cache,

		plugins: [
			eslint({
				exclude: $js.lint.ignore
			}),
			babel({
				babelrc: false,
				exclude: 'node_modules/**',
				presets: [ [ 'es2015', { modules: false } ], 'stage-0', 'react' ],
				plugins: [
					'external-helpers',
					'syntax-object-rest-spread',
					'transform-es2015-parameters',
					'transform-es2015-destructuring',
					'transform-object-rest-spread',
					'transform-class-properties'
				]
			}),
			commonjs({
				exclude: 'node_modules/process-es6/**',
				// include: [
				// 	'node_modules/fbjs/**',
				// 	'node_modules/object-assign/**',
				// 	'node_modules/react/**',
				// 	'node_modules/react-dom/**'
				// ]
			}),
			globals(),
			replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
			resolve({
				jsnext: true,
				main: true,
				browser: true
			}),
			replace({
				ENV: JSON.stringify(process.env.NODE_ENV || 'development')
			}),
			(process.env.NODE_ENV === 'production' && uglify())
		]
	})
	.on('error', handleErrors)
	.on('bundle', (bundle) => {
		cache = bundle
	})
	.pipe(source($js.output))
	.pipe(gulpif(process.env.NODE_ENV === 'production', rename({
		suffix: `-${config.stamp}`
	})))
	.pipe(gulp.dest($js.dest))
})

gulp.task('move-scripts', () => gulp.src($js.libs).pipe(gulp.dest($js.libsDest)))
