/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	STRING_NUMBER,
	validatorIsTypeOf
*/

//=require constants.js
//=require validator/isTypeOf.js

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