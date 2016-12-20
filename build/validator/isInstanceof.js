/**
 * isInstanceOf
 *
 * Check whether a given object is an instance of specified type
 *
 * @param object
 * @param module
 *
 * @return {boolean}
 */
(function() {
	'use strict';
	
	function definition() {
		return function validatorIsInstanceOf(object, module) {
			return object instanceof module;
		};
	}
	
	provide(definition);
}());