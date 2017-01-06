/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	regexMatchParameter, regexMatchBaseUrl, regexIsAbsolutePath, regexIsAbsoluteUri,
	functionResolveUrl
*/

//=require variables.js
//=require function/resolveUrl.js

function functionResolvePath(uri, context) {
	var path = uri.replace(regexMatchParameter, '');

	if(!regexIsAbsolutePath.test(path) && !regexIsAbsoluteUri.test(path)) {
		path = '/' + functionResolveUrl(((context && functionResolveUrl(context + '/../')) || '/') + path).replace(regexMatchBaseUrl, '');
	}

	return path;
}