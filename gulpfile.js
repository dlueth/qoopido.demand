var requireDir = require('require-dir'),
	gulp       = require('gulp'),
	livereload = require('gulp-livereload'),
	config     = require('./gulp/config'),
	tasks      = requireDir('./gulp/tasks', { recurse: true, duplicates: true });

gulp.on('stop', function () {
	if(!livereload.server) {
		process.nextTick(function () {
			process.exit(0);
		});
	}
});

(function() {
	var tree       = gulp.tree().nodes,
		regexMain  = /^\w+$/g,
		regexWatch = /.+:watch$/g,
		tasksMain  = [],
		tasksWatch = [],
		i = 0, task;

	for(; (task = tree[i]) !== undefined; i++) {
		if(regexMain.test(task)) {
			tasksMain.push(task);
		}

		if(regexWatch.test(task)) {
			tasksWatch.push(task);
		}
	}

	gulp.task('default', gulp.parallel.apply(null, tasksMain));
	gulp.task('watch', gulp.parallel.apply(null, tasksWatch));
}());
