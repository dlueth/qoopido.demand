/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	regexMatchParameter,
	functionResolvePath
*/

//=require variables.js
//=require function/resolvePath.js

function functionResolveId(uri, context) {
	var parameter = uri.match(regexMatchParameter);

	return ((parameter && parameter[1]) ? 'mock:' : '') + ((parameter && parameter[3]) || settings.handler) + '!' + functionResolvePath(uri, context);
}