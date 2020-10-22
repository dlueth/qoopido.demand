/* global
	global, document, setTimeout, clearTimeout,
	TRUE, FALSE,
	ClassQueue
*/

//=require class/queue.js

/**
 * idle
 *
 * delay function execution until browser is idle
 * but guarantee execution when browser window gets closed
 *
 * @param {function} function
 * @param {number}   [delay]
 */
var functionIdle = (function() {
	var eventName           = (typeof global.safari === 'object' && global.safari.pushNotification) ? 'beforeunload' : 'visibilitychange',
		requestIdleCallback = global.requestIdleCallback || requestIdleCallbackShim,
		cancelIdleCallback  = global.cancelIdleCallback || cancelIdleCallbackShim,
		queue               = new ClassQueue(),
		current;

	function onVisibilitychange(event) {
		var fn;

		if(queue.length && (event.type !== 'visibilitychange' || document.visibilityState === 'hidden')) {
			current = cancelIdleCallback(current);

			do {
				fn && fn();
			} while(fn = queue.dequeue())
		}
	}

	function requestIdleCallbackShim(fn, options) {
		var start = +new Date();

		return setTimeout(function () {
			fn({
				didTimeout:    FALSE,
				timeRemaining: function () {
					return Math.max(0, 50 - (+new Date() - start));
				}
			});
		}, options && options.timeout);
	}

	function cancelIdleCallbackShim(id) {
		clearTimeout(id);
	}

	function process() {
		queue.dequeue()();

		current = queue.length && requestIdleCallback(process);
	}

	global.addEventListener(eventName, onVisibilitychange, TRUE);

	return function functionIdle(fn) {
		queue.enqueue(fn);

		!current && queue.length && (current = requestIdleCallback(process));
	};
}());
