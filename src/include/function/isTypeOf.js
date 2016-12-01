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

/* global global, document, settings */

function isTypeOf(object, type) {
	return typeof object === type;
}