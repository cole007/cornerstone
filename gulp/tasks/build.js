import gulp from 'gulp'
import sizereport from 'gulp-sizereport'
import gulpSequence from 'gulp-sequence'
import path from 'path'
import { getTasks } from '../libs/utils'

gulp.task('size-report', function () {
	return gulp.src([
		path.resolve(process.env.PWD, PATH_CONFIG.dist, '**/*.css'), 
		path.resolve(process.env.PWD, PATH_CONFIG.dist, '**/*.js')
	])
		.pipe(sizereport({
			gzip: true
		}))
})

export function buildTask(cb) {
	const { assetTasks, codeTasks } = getTasks()
	assetTasks.push('move-scripts')
	codeTasks.push('bundle-script')

	gulpSequence('clean', assetTasks, codeTasks, 'critical', 'cacheBuster', 'size-report', cb)
}

gulp.task('build', buildTask)