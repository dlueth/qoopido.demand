/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	UNDEFINED, FALSE,
	object
*/

//=require constants.js
//=require shortcuts.js

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
 * @return mixed
 */

function functionIterate(source, callback, context) {
	var properties = object.keys(source),
		i = 0, property;

	for(; (property = properties[i]) !== UNDEFINED; i++) {
		if(callback.call(context, property, source[property]) === FALSE) {
			break;
		}
	}

	return context;
}