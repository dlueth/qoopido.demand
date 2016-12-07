/* global
	global, document, demand, provide, queue, processor, settings,
	regexMatchParameter,
	functionResolvePath
*/

function functionResolveId(uri, context) {
	var parameter = uri.match(regexMatchParameter)

	return ((parameter && parameter[3]) || settings.handler) + '!' + functionResolvePath(uri, context);
}