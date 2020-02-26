(function() {
	'use strict';

	function definition(path, abstractHandler, isObject, merge) {
		var regexMatchType = /^text\/html/,
			container      = document.createElement('body'),
			settings       = { suffix: '.html' };

		demand
			.on('postConfigure:' + path, function(options) {
				if(isObject(options)) {
					merge(settings, options);
				}
			});

		function parseHtml(source) {
			var fragment = document.createDocumentFragment(),
				node;

			container.innerHTML = source;

			while(node = container.firstElementChild) {
				fragment.appendChild(node);
			}

			return fragment;
		}

		function HandlerHtml() {}

		HandlerHtml.prototype = {
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
				provide(function() { return parseHtml(dependency.source); });
			}
		};

		return new (HandlerHtml.extends(abstractHandler));
	}

	provide([ 'path', '/demand/abstract/handler', '/demand/validator/isObject', '/demand/function/merge' ], definition);
}());
