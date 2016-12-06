/* global
	global, document, demand, provide, queue, processor, settings
*/

/**
 * isTypeOf
 *
 * Check whether a given object is of specified type
 *
 * @param object
 * @param {string} type
 *
 * @return {boolean}
 */

var validatorIsTypeOf = (function() {
	return function isTypeOf(object, type) {
		return typeof object === type;
	}
}());