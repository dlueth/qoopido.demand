var gulp     = require('gulp'),
	plugins  = require('gulp-load-plugins')(),
	config   = require('../config'),
	shared   = require('../shared'),
	id       = 'bump',
	task     = config.tasks[id];

module.exports = gulp;

gulp.task(id + ':patch', function() {
	return gulp.src(task.watch)
		.pipe(plugins.bump({ type: 'patch' }))
		.pipe(plugins.chmod(shared.rights))
		.pipe(gulp.dest('./'));
});

gulp.task(id + ':minor', function() {
	return gulp.src(task.watch)
		.pipe(plugins.bump({ type: 'minor' }))
		.pipe(plugins.chmod(shared.rights))
		.pipe(gulp.dest('./'));
});

gulp.task(id + ':major', function() {
	return gulp.src(task.watch)
		.pipe(plugins.bump({ type: 'major' }))
		.pipe(plugins.chmod(shared.rights))
		.pipe(gulp.dest('./'));
});