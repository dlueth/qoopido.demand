/**
 * isPositiveInteger
 *
 * Check whether a given value is a positive integer
 *
 * @param value
 *
 * @return {boolean}
 */

/* global global, document, settings */

/* constants */
	//=require constants.js
	/* global STRING_NUMBER */

/* functions */
	//=require function/isTypeOf.js
	/* global isTypeOf */

function isPositiveInteger(value) {
	return isTypeOf(value, STRING_NUMBER) && isFinite(value) && Math.floor(value) === value && value >= 0;
}