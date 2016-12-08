/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	UNDEFINED, FALSE
*/

//=require constants.js

/**
 * iterate
 *
 * Iterate over enumerable & own properties of a given
 * object and pass current property as well as its value
 * to a callback function
 *
 * @param {object} object
 * @param {function} callback
 * @param context
 *
 * @return {object}
 */

function functionIterate(object, callback, context) {
	var properties = Object.keys(object),
		i = 0, property;

	for(; (property = properties[i]) !== UNDEFINED; i++) {
		if(callback.call(context, property, object[property]) === FALSE) {
			break;
		}
	}
}