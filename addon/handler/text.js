(function() {
	'use strict';

	function definition(path, abstractHandler, isObject, merge) {
		var regexMatchType = /^text\/.+/,
			settings       = {};

		demand
			.on('postConfigure:' + path, function(options) {
				if(isObject(options)) {
					merge(settings, options);
				}
			});

		function HandlerText() {}

		HandlerText.prototype = {
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
				provide(function() { return dependency.source; });
			}
		};

		return new (HandlerText.extends(abstractHandler));
	}

	provide([ 'path', '/demand/abstract/handler', '/demand/validator/isObject', '/demand/function/merge' ], definition);
}());
