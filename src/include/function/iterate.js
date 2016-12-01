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

/* global global, document, settings */

/* constants */
	//=require constants.js
	/* global UNDEFINED, FALSE */

function iterate(object, callback, context) {
	var properties = Object.keys(object),
		i = 0, property;

	for(; (property = properties[i]) !== UNDEFINED; i++) {
		if(callback.call(context, property, object[property]) === FALSE) {
			break;
		}
	}
}