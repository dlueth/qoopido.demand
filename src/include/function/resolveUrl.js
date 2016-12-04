/* global global, document, demand, provide, settings */

var resolveUrl = (function() {
	var resolver = document.createElement('a');

	function resolveUrl(url) {
		resolver.href = url;

		return resolver.href;
	}

	return resolveUrl;
}());