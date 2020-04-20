(function() {
	'use strict';

	function definition(path, abstractHandler, Task, Pledge, Failure, isObject, merge) {
		var regexMatchType = /^application\/json/,
			settings       = { suffix: '.json' },
			parseJson      = new Task(function(resolve, reject, source) {
				try {
					resolve(JSON.parse(source));
				} catch(error) {
					reject(error);
				}
			});

		demand
			.on('postConfigure:' + path, function(options) {
				if(isObject(options)) {
					merge(settings, options);
				}
			});

		function HandlerJson() {}

		HandlerJson.prototype = {
			validate: function(type) {
				return regexMatchType.test(type);
			},
			onPreRequest: function(dependency, suffix) {
				var pathname;

				suffix = (typeof suffix !== 'undefined') ? suffix : settings.suffix;

				if(suffix) {
					pathname = dependency.url.pathname;

					dependency.url.pathname = pathname.slice(-suffix.length) !== suffix ? pathname + suffix : pathname;
				}
			},
			process: function(dependency) {
				provide(parseJson(dependency.source));
			}
		};

		return new (HandlerJson.extends(abstractHandler));
	}

	provide([ 'path', '/demand/abstract/handler', '/demand/task', '/demand/pledge', '/demand/failure', '/demand/validator/isObject', '/demand/function/merge' ], definition);
}());
