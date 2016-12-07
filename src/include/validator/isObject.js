/* global
	global, document, demand, provide, queue, processor, settings,
	STRING_OBJECT,
	validatorIsTypeOf
*/

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