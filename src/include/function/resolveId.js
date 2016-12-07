/* global
	global, document, demand, provide, queue, processor, settings,
	regexMatchParameter,
	functionResolvePath
*/

//=require variables.js
//=require function/resolvePath.js

function functionResolveId(uri, context) {
	var parameter = uri.match(regexMatchParameter)

	return ((parameter && parameter[2]) || settings.handler) + '!' + functionResolvePath(uri, context);
}