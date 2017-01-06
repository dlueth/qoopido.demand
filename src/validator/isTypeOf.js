/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage
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

function validatorIsTypeOf(object, type) {
	return typeof object === type;
}