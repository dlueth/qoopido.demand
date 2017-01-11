/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	NULL
*/

//=require constants.js

var abstractHandler = (function() {
	function AbstractHandler() {

	}

	AbstractHandler.prototype = {
		validate: NULL,
		onPreRequest: NULL,
		onPostRequest: NULL,
		onPreProcess: NULL,
		process: NULL
	};

	return new AbstractHandler();
}());