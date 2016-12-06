/* global
	global, document, demand, provide, queue, processor, settings
*/

var functionGetTimestamp = (function() {
	return function getTimestamp() {
		return +new Date();
	}
}());
