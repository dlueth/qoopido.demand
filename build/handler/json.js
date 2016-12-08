(function() {
	'use strict';

	function definition() {
		var regexMatchType = /^application\/json/;

		return {
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
	}

	provide(definition);
}());