/* global global, document, settings */

var escapeRegularExpression = (function() {
	var regexMatchRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

	function escapeRegularExpression(value) {
		return value.replace(regexMatchRegex, '\\$&');
	}

	return escapeRegularExpression;
}());