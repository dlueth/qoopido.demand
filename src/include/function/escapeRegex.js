/* global
	global, document, demand, provide, queue, processor, settings
*/

var functionEscapeRegex = (function() {
	var regexMatchRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

	return function functionEscapeRegex(value) {
		return value.replace(regexMatchRegex, '\\$&');
	};
}());