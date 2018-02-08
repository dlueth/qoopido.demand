var gulp     = require('gulp'),
	sequence = require('run-sequence').use(gulp),
	plugins  = require('gulp-load-plugins')(),
	path     = require('path'),
	clean    = require('del'),
	shared   = require('../shared'),
	config   = require('../config'),
	filename = path.basename(__filename),
	id       = filename.substr(0, filename.indexOf('.')),
	task     = config.tasks[id];

module.exports = gulp;

gulp.task(id, function(callback) {
	return sequence(id + ':lint', id + ':clean', id + ':build', callback);
});

gulp.task(id + ':lint', function() {
	return gulp.src(task.lint || task.watch)
		.pipe(plugins.eslint())
		.pipe(plugins.eslint.format());
});

gulp.task(id + ':clean', function(callback) {
	return clean(task.clean || task.dest + '/**/*', callback);
});

gulp.task(id + ':build', function() {
	return gulp.src(task.build || task.watch)
		.pipe(plugins.plumber({ errorHandler: shared.handleError}))
		.pipe(plugins.rename({ suffix: '.min' }))
		.pipe(plugins.uglify())
		.pipe(plugins.wrap({ src: './snippets/wrapper.tpl'}))
		.pipe(plugins.chmod(shared.rights))
		.pipe(plugins.size({ showFiles: true, gzip: true }))
		.pipe(gulp.dest(task.dest));
});