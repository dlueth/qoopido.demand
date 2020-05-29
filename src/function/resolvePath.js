/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	regexMatchParameter, regexMatchBaseUrl, regexIsRelativePath,
	functionResolveUrl
*/

//=require variables.js
//=require function/resolveUrl.js

function functionResolvePath(uri, context) {
	var path = uri.replace(regexMatchParameter, '');

	if(regexIsRelativePath.test(path)) {
		path = '/' + functionResolveUrl(((context && functionResolveUrl(context + '/../')) || '/') + path).replace(regexMatchBaseUrl, '');
	}

	return path;
}
