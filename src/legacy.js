/**
 * Qoopido demand - legacy polyfills
 *
 * Polyfills required to provide IE8 compatibility
 *
 * Copyright (c) 2016 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

(function(functionPrototype, objectPrototype, arrayPrototype, undefined) {
	'use strict';

	var arrayPrototypeSlice = arrayPrototype.slice,
		NULL                = null,
		STRING_FUNCTION     = 'function';

	function isTypeOf(object, type) {
		return typeof object === type;
	}

	function isObject(object) {
		return object && isTypeOf(object, 'object');
	}

	if(!functionPrototype.bind) {
		functionPrototype.bind = function(context) {
			var self = this,
				parameter, target, Constructor, bound;

			if(isTypeOf(self, STRING_FUNCTION)) {
				parameter   = arrayPrototypeSlice.call(arguments, 1);
				target      = self;
				Constructor = function() {};
				bound       = function() {
					return target.apply(self instanceof Constructor ? self : context, parameter.concat(arrayPrototypeSlice.call(arguments)));
				};

				Constructor.prototype = self.prototype;
				bound.prototype       = new Constructor();

				return bound;
			} else {
				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}
		};
	}

	if(!Object.keys) {
		Object.keys = (function() {
			var hasOwnProperty = objectPrototype.hasOwnProperty,
				hasEnumBug     = !({ toString: NULL }).propertyIsEnumerable('toString'),
				properties     = [ 'toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor' ];

			return function(object) {
				var keys = [],
					i = 0, property;

				if(!isObject(object) && !isTypeOf(object, STRING_FUNCTION)) {
					throw new TypeError('Object.keys called on non-object');
				}

				for(property in object) {
					if(hasOwnProperty.call(object, property)) {
						keys.push(property);
					}
				}

				if(hasEnumBug) {
					for(; (property = properties[i]) !== undefined; i++) {
						if(hasOwnProperty.call(object, property)) {
							keys.push(property);
						}
					}
				}

				return keys;
			};
		}());
	}
}(Function.prototype, Object.prototype, Array.prototype));