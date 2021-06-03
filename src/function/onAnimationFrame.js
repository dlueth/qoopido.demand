/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	requestAnimationFrame,
	functionFPS,
	ClassQueue
*/

//=require shortcuts.js
//=require function/fps.js
//=require class/queue.js

/**
 * onAnimationFrame
 *
 * call callback via RequestAnimationFrame
 *
 * @param {function} fn
 */
var functionOnAnimationFrame = (function() {
	var queue  = new ClassQueue(),
		duration = 0, start, budget, current;

	function process() {
		start  = performance.now();
		budget = (1000 / 60) * (0.2 * (Math.min(60, functionFPS()) / 60));

		current();

		duration += performance.now() - start;
		current   = current = queue.dequeue();

		if(duration < budget) {
			current && process();
		} else {
			duration = 0;

			current && handle();
		}
	}

	function handle() {
		requestAnimationFrame(process);
	}

	return function functionOnAnimationFrame(fn) {
		queue.enqueue(fn);

		if(!current && (current = queue.dequeue())) {
			handle();
		}
	};
}());
