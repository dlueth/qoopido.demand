(function() {
	'use strict';

	function definition() {
		var regexMatchType = /^text\/.+/;

		return {
			validate: function(type) {
				return regexMatchType.test(type);
			},
			process: function() {
				var self = this;

				provide(function() { return self.source; });
			}
		};
	}

	provide(definition);
}());