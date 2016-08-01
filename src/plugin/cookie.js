/**
 * Qoopido.demand plugin/cookie
 *
 * Copyright (c) 2016 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

(function(document) {
	'use strict';

	function definition(path, isObject, isTypeOf) {
		var pattern = [],
			enabled, key;
		
		function onPostConfigure(options) {
			if(isObject(options)) {
				pattern.length = 0;
				
				for(key in options) {
					pattern.push({ pattern: key, weight: key.length, state: options[key] });
				}
			} else if(isTypeOf(options, 'boolean')) {
				enabled = options;
			}
		}
		
		demand.on('postConfigure:' + path, onPostConfigure);

		function setCookie(path, value, expiration) {
			document.cookie = 'demand[' + path + ']=' + encodeURIComponent(value) + '; expires=' + expiration + '; path=/';
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

		demand
			.on('cacheMiss cacheClear', function(item) {
				item = typeof item === 'string' ? item : item.path;

				if(enabled || isEnabled(item)) {
					setCookie(item, '', 'Thu, 01 Jan 1970 00:00:00 GMT');
				}
			})
			.on('postCache', function(loader) {
				if(enabled || isEnabled(loader.path)) {
					setCookie(loader.path, JSON.stringify(loader.state), 'Fri, 31 Dec 9999 23:59:59 GMT');
				}
			});

		return true;
	}

	provide([ 'path', '/demand/validator/isObject', '/demand/validator/isTypeOf' ], definition);
}(document));