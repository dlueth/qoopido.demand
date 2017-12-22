/* global
	LZString
*/

(function() {
	'use strict';

  //=include vendor/lz-string/libs/lz-string.js

	function definition(path, iterate, isObject, isTypeOf) {
		var pattern = [ { pattern: path, weight: path.length, state: false }],
				storage = {};

		demand
			.on('postConfigure:' + path, function(options) {
				if(isObject(options)) {
					pattern.length = 0;

					iterate(options, function(key, value) {
						pattern.push({ pattern: key, weight: key.length, state: value });
					});
				} else if(isTypeOf(options, 'boolean')) {
					pattern.push({ pattern: '', weight: 0, state: options });
				}
			})
			.on('cacheHit', function(dependency) {
				if(isEnabled(dependency.path)) {
					storage[dependency.id] = true;
				}
			})
			.on('preCache', function(dependency) {
				if(isEnabled(dependency.path)) {
					dependency.source = LZString.compressToUTF16(dependency.source);
				}
			})
			.on('preProcess', function(dependency) {
				if(storage[dependency.id]) {
					dependency.source = LZString.decompressFromUTF16(dependency.source);
				}
			});

		function isEnabled(path) {
			var i = 0, pointer, match;

			for(; (pointer = pattern[i]); i++) {
				if(path.indexOf(pointer.pattern) === 0 && (!match || pointer.weight > match.weight)) {
					match = pointer;
				}
			}

			return match ? match.state : false;
		}

		return LZString;
	}

	provide([ 'path', '/demand/function/iterate', '/demand/validator/isObject', '/demand/validator/isTypeOf' ], definition);
}());