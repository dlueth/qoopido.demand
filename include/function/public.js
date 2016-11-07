/**
 * isArray
 *
 * Check whether a given value is of type array
 *
 * @param value
 *
 * @return {boolean}
 */
function isArray(value) {
	return objectPrototypeToString.call(value) === '[object Array]';
}

/**
 * isObject
 *
 * Check whether a given object is of type object
 *
 * @param object
 *
 * @return {boolean}
 */
function isObject(object) {
	return object && isTypeOf(object, 'object');
}

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
function isTypeOf(object, type) {
	return typeof object === type;
}

/**
 * isInstanceOf
 *
 * Check whether a given object is an instance of specified type
 *
 * @param object
 * @param module
 *
 * @return {boolean}
 */
function isInstanceOf(object, module) {
	return object instanceof module;
}

/**
 * isPositiveInteger
 *
 * Check whether a given value is a positive integer
 *
 * @param value
 *
 * @return {boolean}
 */
function isPositiveInteger(value) {
	return isTypeOf(value, 'number') && isFinite(value) && Math.floor(value) === value && value >= 0;
}

/**
 * merge
 *
 * Merge two or more objects into the first one passed in
 *
 * @param {...object} object
 *
 * @return {object}
 */
function merge() {
	var target = arguments[0],
		i = 1, properties;
	
	for(; (properties = arguments[i]) !== undefined; i++) {
		iterate(properties, mergeProperties, target);
	}
	
	return target;
}

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
function iterate(object, callback, context) {
	var properties = Object.keys(object),
		i = 0, property;
	
	for(; (property = properties[i]) !== undefined; i++) {
		if(callback.call(context, property, object[property]) === false) {
			break;
		}
	}
}