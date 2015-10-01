/**
 * Qoopido.demand plugin/cookie
 *
 * Improved from:
 * https://github.com/pieroxy/lz-string
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

(function(document) {
	'use strict';

	function definition(settings) {
		var pattern = [],
			storage = {},
			key;

		function setCookie(path, value, expiration) {
			document.cookie = 'demand[' + path + ']=' + encodeURIComponent(value) + '; expires=' + expiration + '; path=/';
		}

		function isEnabled(path) {
			var i, pointer, match;

			if(!storage[path]) {
				for(i = 0; (pointer = pattern[i]); i++) {
					if(path.indexOf(pointer.pattern) === 0 && (!match || pointer.weight > match.weight)) {
						match = pointer;
					}
				}

				storage[path] = match ? match.state : false;
			}

			return storage[path];
		}

		function Pattern(pattern, state) {
			return {
				pattern: pattern,
				weight:  pattern.length,
				state:   state
			};
		}

		for(key in settings) {
			pattern.push(new Pattern(key, settings[key]));
		}

		demand
			.on('postCache', function(loader) {
				if(isEnabled(loader.path)) {
					setCookie(loader.path, loader.state, 'Fri, 31 Dec 9999 23:59:59 GMT');
				}
			})
			.on('preRequest cacheClear', function(item) {
				item = typeof item === 'string' ? item : item.path;

				if(isEnabled(item)) {
					setCookie(item, '', 'Thu, 01 Jan 1970 00:00:00 GMT');
				}
			});

		return true;
	}

	provide([ 'settings' ], definition);
}(document));