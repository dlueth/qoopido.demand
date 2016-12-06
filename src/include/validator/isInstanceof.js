/* global
	global, document, demand, provide, queue, processor, settings
*/

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
var validatorIsInstanceOf = (function() {
	return function isInstanceOf(object, module) {
		return object instanceof module;
	};
}());