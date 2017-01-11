(function() {
	'use strict';

	function definition(abstractHandler) {
		var regexMatchType = /^text\/.+/;

		function HandlerText() {}

		HandlerText.prototype = {
			validate: function(type) {
				return regexMatchType.test(type);
			},
			process: function() {
				var self = this;

				provide(function() { return self.source; });
			}
		};

		return new (HandlerText.extends(abstractHandler));
	}

	provide([ '/demand/abstract/handler' ],definition);
}());