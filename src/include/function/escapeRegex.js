/* global
	global, document, demand, provide, queue, processor, settings
*/

var functionEscapeRegex = (function() {
	var regexMatchRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

	function escapeRegex(value) {
		return value.replace(regexMatchRegex, '\\$&');
	}

	return escapeRegex;
}());