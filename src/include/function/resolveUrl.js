/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout
*/

var functionResolveUrl = (function() {
	var resolver = document.createElement('a');

	return function functionResolveUrl(url) {
		resolver.href = url;

		return resolver.href;
	};
}());