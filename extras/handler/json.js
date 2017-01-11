(function() {
	'use strict';

	function definition(abstractHandler) {
		var regexMatchType = /^application\/json/;

		function HandlerJson() {}

		HandlerJson.prototype = {
			validate: function(type) {
				return regexMatchType.test(type);
			},
			onPreRequest: function() {
				var url = this.url;

				this.url = url.slice(-5) !== '.json' ? url + '.json' : url;
			},
			process: function() {
				var data = JSON.parse(this.source);

				provide(function() { return data; });
			}
		};

		return new (HandlerJson.extends(abstractHandler));
	}

	provide([ '/demand/abstract/handler' ], definition);
}());