/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage
*/

var functionEscapeRegex = (function() {
	// eslint-disable-next-line no-useless-escape
	var regexMatchRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

	return function functionEscapeRegex(value) {
		return value.replace(regexMatchRegex, '\\$&');
	};
}());
