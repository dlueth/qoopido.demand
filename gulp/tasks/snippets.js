var id         = 'snippets',
	gulp       = require('gulp'),
	pump       = require('pump'),
	del        = require('del'),
	path       = require('path'),
	plugins    = require('gulp-load-plugins')(),
	livereload = require('gulp-livereload'),
	config     = require('../config'),
	settings   = config.tasks[id];

function watch() {
	livereload.listen();

	return gulp.watch(settings.watch, gulp.series(id + ':lint', id + ':build'))
		.on('unlink', function(file) {
			/*
			var relpath  = path.relative(path.resolve('src'), file),
				resolved = path.resolve('build', relpath);

			console.log(file, relpath, resolved);
			*/
			//del.sync(resolved);
		});
}

function lint() {
	return gulp.src(settings.watch)
		.pipe(plugins.eslint())
		.pipe(plugins.eslint.format())
		.pipe(plugins.eslint.failAfterError())
		.pipe(plugins.size(config.settings.size));
}

function clean() {
	return del(settings.clean, { force: true });
}
function build(done) {
	pump([
		gulp.src(settings.process || settings.watch),
		plugins.uglify({
			compress: {
				'passes':  5,
				'typeofs': false
			}
		}),
		plugins.wrap({ src: './snippets/wrapper.tpl'}),
		plugins.rename({ suffix: '.min' }),
		plugins.chmod(config.permissions),
		plugins.size(config.settings.size),
		gulp.dest(settings.dest),
		plugins.touchFd()
	], function() {
		livereload.reload();
		done();
	});
}

gulp.task(id + ':watch', watch);
gulp.task(id + ':lint', lint);
gulp.task(id + ':clean', clean);
gulp.task(id + ':build', build);
gulp.task(id, gulp.series(id + ':lint', id + ':clean', id + ':build'));
