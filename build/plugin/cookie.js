(function(document) {
	'use strict';

	function definition(path, iterate, isObject, isTypeOf) {
		var past    = 'Thu, 01 Jan 1970 00:00:00 GMT',
			future  = 'Fri, 31 Dec 9999 23:59:59 GMT',
			pattern = [],
			enabled;
		
		demand.
			on('postConfigure:' + path, function(options) {
				if(isObject(options)) {
					pattern.length = 0;

					iterate(options, function(key, value) {
						pattern.push({ pattern: key, weight: key.length, state: value });
					});
				} else if(isTypeOf(options, 'boolean')) {
					enabled = options;
				}
			})
			.on('cacheMiss', function(dependency) {
				setCookie(dependency.path, '', past);
			})
			.on('cacheClear', function(path) {
				setCookie(path, '', past);
			})
			.on('postCache', function(dependency, state) {
				setCookie(dependency.path, JSON.stringify(state), future);
			});

		function setCookie(path, value, expiration) {
			if(enabled || isEnabled(path)) {
				document.cookie = 'demand[' + path + ']=' + encodeURIComponent(value) + '; expires=' + expiration + '; path=/';
			}
		}

		function isEnabled(path) {
			var i = 0, pointer, match;

			for(; (pointer = pattern[i]); i++) {
				if(path.indexOf(pointer.pattern) === 0 && (!match || pointer.weight > match.weight)) {
					match = pointer;
				}
			}

			return match ? match.state : false;
		}

		return true;
	}

	provide([ 'path', '/demand/function/iterate', '/demand/validator/isObject', '/demand/validator/isTypeOf' ], definition);
}(document));