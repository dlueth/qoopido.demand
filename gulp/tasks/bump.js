var gulp     = require('gulp'),
	plugins  = require('gulp-load-plugins')(),
	config   = require('../config'),
	id       = 'bump',
	task     = config.tasks[id];

module.exports = gulp;

gulp.task(id + ':patch', function() {
	return gulp.src(task.watch)
		.pipe(plugins.bump({ type: 'patch' }))
		.pipe(plugins.chmod(0o644))
		.pipe(gulp.dest('./'));
});

gulp.task(id + ':minor', function() {
	return gulp.src(task.watch)
		.pipe(plugins.bump({ type: 'minor' }))
		.pipe(plugins.chmod(0o644))
		.pipe(gulp.dest('./'));
});

gulp.task(id + ':major', function() {
	return gulp.src(task.watch)
		.pipe(plugins.bump({ type: 'major' }))
		.pipe(plugins.chmod(0o644))
		.pipe(gulp.dest('./'));
});