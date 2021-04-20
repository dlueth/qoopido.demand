/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	requestAnimationFrame,
	functionFPS,
	functionOnIdle,
	ClassQueue
*/

//=require shortcuts.js
//=require function/fps.js
//=require function/onIdle.js
//=require class/queue.js

/**
 * onAnimationFrame
 *
 * call callback via RequestAnimationFrame optionally
 * after a requestIdleCallback has fired
 *
 * @param {boolean} idle
 * @param {function} fn
 */
var functionOnAnimationFrame = (function() {
	var queue  = new ClassQueue(),
		budget = (1000 / 60) * (0.2 * (Math.min(60, functionFPS()) / 60)),
		duration = 0, current, start;

	function process(idle) {
		start = performance.now();

		current();

		duration += performance.now() - start;
		current   = current = queue.dequeue();

		if(duration < budget) {
			current && process(idle);
		} else {
			duration = 0;

			if(current) {
				if(idle) {
					functionOnIdle(handle.bind(null, idle));
				} else {
					handle(idle);
				}
			}
		}
	}

	function handle(idle) {
		requestAnimationFrame(idle ? process.bind(null, idle) : process);
	}

	return function functionOnAnimationFrame(idle, fn) {
		queue.enqueue(fn);

		if(!current && (current = queue.dequeue())) {
			if(idle) {
				functionOnIdle(handle.bind(null, idle));
			} else {
				handle(idle);
			}
		}
	};
}());
