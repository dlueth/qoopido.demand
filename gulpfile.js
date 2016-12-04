var requireDir = require('require-dir'),
	gulp       = require('gulp'),
	net        = require('net'),
	livereload = require('gulp-livereload'),
	config     = require('./gulp/config'),
	tasks      = requireDir('./gulp/tasks', { recurse: true, duplicates: true }),
	watch      = {},
	watching   = false;

module.exports = gulp;

gulp.on('stop', function () {
	if(watching === false) {
		process.nextTick(function () {
			process.exit(0);
		});
	}
});

function addWatchTask(name, settings) {
	gulp.task(name + ':watch', function() {
		watching = true;

		gulp.watch(settings.watch, [ name ])
			.on('change', livereload.changed);
	});

	watch[name] = settings.watch;
}

(function initialize() {
	var name, task, settings;

	livereload.listen();

	for(name in gulp.tasks) {
		task     = gulp.tasks[name];
		settings = config.tasks[name];

		if(task && settings && settings.watch) {
			addWatchTask(name, settings);
		}
	}
}());

gulp.task('watch', function() {
	var name;

	watching = true;

	for(name in watch) {
		gulp.watch(watch[name], [ name ])
			.on('change', livereload.changed);
	}
});

gulp.task('default', [ 'watch' ]);