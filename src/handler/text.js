(function() {
	'use strict';

	function definition() {
		return {
			process: function() {
				var self = this;

				provide(function() { return self.source; });
			}
		};
	}

	provide(definition);
}());