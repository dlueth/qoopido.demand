(function() {
	'use strict';

	function definition(abstractHandler) {
		var suffix         = '.html',
			regexMatchType = /^text\/html/,
			container      = document.createElement('body');

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
			onPreRequest: function(dependency) {
				var pathname = dependency.url.pathname;
				
				dependency.url.pathname = pathname.slice(-suffix.length) !== suffix ? pathname + suffix : pathname;
			},
			process: function(dependency) {
				provide(function() { return parseHtml(dependency.source); });
			}
		};

		return new (HandlerHtml.extends(abstractHandler));
	}

	provide([ '/demand/abstract/handler' ], definition);
}());