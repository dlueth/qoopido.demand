/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
 	EVENT_PRE_REQUEST, EVENT_POST_REQUEST, ERROR_LOAD,
	regexIsAbsoluteUri,
	functionIterate, functionResolveUrl,
	ClassXhr, ClassFailure,
	singletonEvent
*/

//=require constants.js
//=require variables.js
//=require function/resolveUrl.js
//=require function/iterate.js
//=require singleton/event.js
//=require class/xhr.js
//=require class/failure.js

function ClassLoader(dependency) {
	var pattern;

	if(!regexIsAbsoluteUri.test(dependency.path)) {
		functionIterate(settings.pattern, function(property, value) {
			value.matches(dependency.path) && (!pattern || pattern.weight < value.weight) && (pattern = value);
		});
	}

	dependency.url = pattern ? functionResolveUrl(pattern.process(dependency.path)) : dependency.path;

	singletonEvent.emit(EVENT_PRE_REQUEST, dependency.type, dependency);

	new ClassXhr(dependency.url).then(
		function(response, type) {
			if(!dependency.handler.validate || dependency.handler.validate(type)) {
				dependency.source = response;

				singletonEvent.emit(EVENT_POST_REQUEST, dependency.type, dependency);
			} else {
				dependency.deferred.reject(new ClassFailure(ERROR_LOAD + ' (content-type)', dependency.path));
			}
		},
		function(status) {
			dependency.deferred.reject(new ClassFailure(ERROR_LOAD + (status ? ' (status)' : ''), dependency.path));
		}
	);
}