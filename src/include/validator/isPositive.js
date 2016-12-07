/* global
	global, document, demand, provide, queue, processor, settings,
	STRING_NUMBER,
	validatorIsTypeOf
*/

/**
 * isPositive
 *
 * Check whether a given value is a positive integer
 *
 * @param value
 *
 * @return {boolean}
 */

function validatorIsPositive(value) {
	return validatorIsTypeOf(value, STRING_NUMBER) && isFinite(value) && Math.floor(value) === value && value >= 0;
}