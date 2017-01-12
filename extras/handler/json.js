(function() {
	'use strict';

	function definition(abstractHandler) {
		var regexMatchType = /^application\/json/;

		function HandlerJson() {}

		HandlerJson.prototype = {
			validate: function(type) {
				return regexMatchType.test(type);
			},
			onPreRequest: function(dependency) {
				var url = dependency.url;

				dependency.url = url.slice(-5) !== '.json' ? url + '.json' : url;
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