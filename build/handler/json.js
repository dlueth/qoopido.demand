(function() {
	'use strict';

	function definition() {
		return {
			matchType: /^application\/json/,
			onPreRequest: function() {
				var self = this,
					url  = self.url;

				self.url = url.slice(-5) !== '.json' ? url + '.json' : url;
			},
			process: function() {
				var data = JSON.parse(this.source);

				provide(function() { return data; });
			}
		};
	}

	provide(definition);
}());