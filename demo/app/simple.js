;(function() {
	'use strict';

	function definition(demand, provide) {
		function appSimple() {
		}

		return appSimple;
	}

	provide(definition)
		.when('demand', 'provide');
}());