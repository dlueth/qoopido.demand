/* global
	global, document, demand, provide, queue, processor, settings,
	objectPrototypeToString
*/

/**
 * isArray
 *
 * Check whether a given value is of type array
 *
 * @param value
 *
 * @return {boolean}
 */

var validatorIsArray = (function() {
	return function isArray(value) {
		return objectPrototypeToString.call(value) === '[object Array]';
	}
}());