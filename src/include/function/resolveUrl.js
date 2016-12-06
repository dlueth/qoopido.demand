/* global
	global, document, demand, provide, queue, processor, settings
*/

var functionResolveUrl = (function() {
	var resolver = document.createElement('a');

	function resolveUrl(url) {
		resolver.href = url;

		return resolver.href;
	}

	return resolveUrl;
}());