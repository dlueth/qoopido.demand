/* eslint no-unused-vars:0 */
(function() {
	'use strict';

	function definition(demand, provide) {
		function appOne() {
		}

		return appOne;
	}

	provide([ 'demand', 'provide' ], definition);
}());