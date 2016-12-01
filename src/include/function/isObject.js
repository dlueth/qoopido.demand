/**
 * isObject
 *
 * Check whether a given object is of type object
 *
 * @param object
 *
 * @return {boolean}
 */

/* global global, document, settings */

/* constants */
	//=require constants.js
	/* global STRING_OBJECT */

/* functions */
	//=require function/isTypeOf.js
	/* global isTypeOf */

var isObject = (function() {
	function isObject(object) {
		return object && isTypeOf(object, STRING_OBJECT);
	}

	return isObject;
}());