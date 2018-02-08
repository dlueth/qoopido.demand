/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	STRING_OBJECT,
	validatorIsTypeOf
*/

//=require constants.js
//=require validator/isTypeOf.js

/**
 * isObject
 *
 * Check whether a given object is of type object
 *
 * @param object
 *
 * @return {boolean}
 */

function validatorIsObject(object) {
	return object && validatorIsTypeOf(object, STRING_OBJECT);
}
