/**
 * isArray
 *
 * Check whether a given value is of type array
 *
 * @param value
 *
 * @return {boolean}
 */

/* global global, document, demand, provide, settings */

/* shortcuts */
	//=require shortcuts.js
	/* global objectPrototypeToString */

function isArray(value) {
	return objectPrototypeToString.call(value) === '[object Array]';
}