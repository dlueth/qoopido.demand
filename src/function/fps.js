/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	requestAnimationFrame
*/

//=require shortcuts.js

var functionFPS = (function() {
	var now    = performance.now(),
		frames = [ now ];

	function process() {
		now = performance.now();

		frames.push(now);

		frames = frames.slice(-300);

		requestAnimationFrame(process);
	}

	requestAnimationFrame(process);

	return function functionFPS() {
		return Math.floor(frames.length / ((now - frames[0]) / 1000));
	};
}());
