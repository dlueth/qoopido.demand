(function() {
	'use strict';

	function definition(abstractHandler) {
		var suffix         = '.json',
			regexMatchType = /^application\/json/;

		function HandlerJson() {}

		HandlerJson.prototype = {
			validate: function(type) {
				return regexMatchType.test(type);
			},
			onPreRequest: function(dependency) {
				var pathname = dependency.url.pathname;
				
				dependency.url.pathname = pathname.slice(-suffix.length) !== suffix ? pathname + suffix : pathname;
			},
			process: function(dependency) {
				var data = JSON.parse(dependency.source);

				provide(function() { return data; });
			}
		};

		return new (HandlerJson.extends(abstractHandler));
	}

	provide([ '/demand/abstract/handler' ], definition);
}());