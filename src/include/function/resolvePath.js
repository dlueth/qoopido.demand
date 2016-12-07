/* global
	global, document, demand, provide, queue, processor, settings,
	regexMatchParameter, regexMatchBaseUrl, regexIsAbsoluteUri
	functionResolveUrl
*/

var functionResolvePath = (function() {
	var regexIsAbsolutePath = /^\//;

	return function functionResolvePath(uri, context) {
		var path = uri.replace(regexMatchParameter, '');

		if(!regexIsAbsolutePath.test(path) && !regexIsAbsoluteUri.test(path)) {
			path = '/' + functionResolveUrl(((context && functionResolveUrl(context + '/../')) || '/') + path).replace(regexMatchBaseUrl, '');
		}

		return path;
	};
}());