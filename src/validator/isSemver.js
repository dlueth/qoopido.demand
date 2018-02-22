/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	STRING_STRING,
	validatorIsTypeOf
*/

//=require constants.js
//=require validator/isTypeOf.js

/**
 * isSemver
 *
 * Check whether a given value is a valid version according to semver 2.0.0
 *
 * @param value
 *
 * @return {boolean}
 */

var validatorIsSemver = (function() {
	var regexMatchSemver = /^\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b$/i;

	return function validatorIsSemver(value) {
		return validatorIsTypeOf(value, STRING_STRING) && regexMatchSemver.test(value);
	}
}());
