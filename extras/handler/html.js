(function() {
	'use strict';

	function definition(abstractHandler) {
		var regexMatchType = /^text\/html/,
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
			process: function(dependency) {
				provide(function() { return parseHtml(dependency.source); });
			}
		};

		return new (HandlerHtml.extends(abstractHandler));
	}

	provide([ '/demand/abstract/handler' ], definition);
}());