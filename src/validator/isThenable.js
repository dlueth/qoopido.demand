/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	STRING_FUNCTION,
	validatorIsTypeOf
*/

/**
 * isThenable
 *
 * Check whether a given value is of type thenable
 *
 * @param value
 *
 * @return {boolean}
 */

function validatorIsThenable(value) {
	return value && validatorIsTypeOf(value.then, STRING_FUNCTION);
}
