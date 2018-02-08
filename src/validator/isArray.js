/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	objectPrototypeToString
*/

//=require shortcuts.js

/**
 * isArray
 *
 * Check whether a given value is of type array
 *
 * @param value
 *
 * @return {boolean}
 */

function validatorIsArray(value) {
	return objectPrototypeToString.call(value) === '[object Array]';
}
