/**
 * Qoopido demand - legacy polyfills
 *
 * Polyfills required to provide IE8 compatibility
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

;(function(functionPrototype, objectPrototype, arrayPrototype) {
	'use strict';

	var arrayPrototypeSlice     = arrayPrototype.slice,
		objectPrototypeToString = objectPrototype.toString;

	if(!functionPrototype.bind) {
		functionPrototype.bind = function(context) {
			var self = this,
				parameter, target, Constructor, bound;

			if(typeof self === 'function') {
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

	if(!arrayPrototype.forEach) {
		arrayPrototype.forEach = function(callback, context) {
			var self = this,
				object, length, i = 0;

			if(self !== null) {
				object = Object(self);
				length = object.length >>> 0;

				if(typeof callback === 'function') {
					while(i < length) {
						if(i in object) {
							callback.call(context, object[i], i, object);
						}

						i++;
					}
				} else {
					throw new TypeError(callback + ' is not a function');
				}
			} else {
				throw new TypeError('this is null or not defined');
			}
		};
	}

	if(!Array.isArray) {
		Array.isArray = function (value) {
			return objectPrototypeToString.call(value) === '[object Array]';
		};
	}
}(Function.prototype, Object.prototype, Array.prototype));