;(function() {
	'use strict';

	function definition(demand, provide) {
		function appSimple() {
		}

		return appSimple;
	}

	provide([ 'demand', 'provide' ], definition);
}());