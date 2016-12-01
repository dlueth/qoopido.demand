/**
 * merge
 *
 * Merge two or more objects into the first one passed in
 *
 * @param {...object} object
 *
 * @return {object}
 */

/* global global, document, settings */

/* constants */
	//=require constants.js
	/* global UNDEFINED */

/* functions */
	//=require function/isObject.js
	//=require function/iterate.js
	/* global isObject, iterate */

var merge = (function() {
	function mergeProperties(property, value) {
		var targetProperty = this[property],
			targetPropertyIsObject;

		if(value !== UNDEFINED) {
			if(isObject(value)) {
				targetPropertyIsObject = isObject(targetProperty);

				if(value.length !== UNDEFINED) {
					targetProperty = (targetPropertyIsObject && targetProperty.length !== UNDEFINED) ? targetProperty : [];
				} else {
					targetProperty = (targetPropertyIsObject && targetProperty.length === UNDEFINED) ? targetProperty : {};
				}

				this[property] = merge(targetProperty, value);
			} else {
				this[property] = value;
			}
		}
	}

	function merge() {
		var target = arguments[0],
			i = 1, properties;

		for(; (properties = arguments[i]) !== UNDEFINED; i++) {
			iterate(properties, mergeProperties, target);
		}

		return target;
	}

	return merge;
}());