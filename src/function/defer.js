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
	var storage, observer, element;

	if('setImmediate' in global && typeof global.setImmediate === 'function') {
		return global.setImmediate;
	}

	if('MutationObserver' in global && typeof global.MutationObserver === 'function') {
		storage  = {};
		element  = document.createElement('div');
		observer = new MutationObserver(function(records) {
			records.forEach(function(record) {
				var uuid = record.attributeName.substr(1);

				storage[uuid] && storage[uuid]();

				delete storage[uuid];
			});
		});

		observer.observe(element, { attributes: TRUE });

		return function functionDefer(fn) {
			var uuid = functionUuid();

			storage[uuid] = fn;

			element.setAttribute('i' + uuid, 1);
		};
	}

	return setTimeout;
}());
