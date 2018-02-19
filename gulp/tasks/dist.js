var id         = 'dist',
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
		// beautify
		plugins.include(config.settings.include),
		plugins.injectVersion({ prepend: '', replace: '{{package.version}}' }),
		plugins.uglify({
			mangle: false,
			compress: {
				'booleans':     false,
				'comparisons':  false,
				'conditionals': false,
				'hoist_funs':   true,
				'hoist_props':  false,
				'hoist_vars':   true,
				'inline':       false,
				'loops':        false,
				'negate_iife':  false,
				'passes':       5,
				'reduce_funcs': false,
				'reduce_vars':  false,
				'sequences':    false,
				'typeofs':      false
			}
		}),
		plugins.jsbeautifier({
			'indent_with_tabs':      true,
			'space_in_empty_paren':  false,
			'end_with_newline':      true,
			'preserve_newlines':     true,
			'jslint_happy':          true,
			'break_chained_methods': true,
			'good_stuff':            true
		}),
		plugins.header(config.banner),
		// generate minified
		plugins.sourcemaps.init({ largeFile: true }),
		plugins.uglify({
			compress: {
				'passes':  5,
				'typeofs': false
			}
		}),
		plugins.header(config.banner),
		plugins.chmod(config.permissions),
		plugins.size(config.settings.size),
		plugins.sourcemaps.write('.'),
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
