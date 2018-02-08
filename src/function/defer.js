/**
 * Based on setAsap:
 *   Repo:    https://github.com/taylorhakes/setAsap
 *   License: https://github.com/taylorhakes/setAsap/blob/master/LICENSE
 */

/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	NULL, TRUE, FALSE,
	functionUuid
*/

//=require constants.js
//=require shortcuts.js
//=require function/uuid.js

/**
 * defer
 *
 * delay function execution like setImmediate does
 *
 * @param {function} function
 */
var functionDefer = (function() {
	var hasSetImmediate = 'setImmediate' in global,
		element, fallback;

	if('MutationObserver' in global) {
		return function functionDefer(fn) {
			element = document.createElement('div');

			new MutationObserver(function() { fn(); })
				.observe(element, { attributes: TRUE });

			element.setAttribute('i', '1');
		};
	}

	if(!hasSetImmediate && 'postMessage' in global && !('importScripts' in global) && 'addEventListener' in global) {
		return (function() {
			var storage = {};

			function onMessage(event) {
				var fn;

				if(event.source === global && event.data && (fn = storage[event.data])) {
					fn();

					delete storage[event.data];
				}
			}

			global.addEventListener('message', onMessage, FALSE);

			return function functionDefer(fn) {
				var uuid = functionUuid();

				storage[uuid] = fn;

				global.postMessage(uuid, '*');
			};
		}());
	}

	if(!hasSetImmediate && 'onreadystatechange' in (element = document.createElement('script'))) {
		return function functionDefer(fn) {
			element.onreadystatechange = function onreadystatechange() {
				element.onreadystatechange = NULL;
				element.parentNode.removeChild(element);

				fn();
			};

			document.body.appendChild(element);
		};
	}

	fallback = hasSetImmediate ? setImmediate : setTimeout; // eslint-disable-line no-undef

	return function functionDefer(fn) {
		fallback(fn);
	};
}());
