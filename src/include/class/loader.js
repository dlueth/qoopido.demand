/* global
	global, document, demand, provide, queue, processor, settings,
 	EVENT_PRE_REQUEST, EVENT_POST_REQUEST,
	regexIsAbsoluteUri,
	functionIterate, functionResolveUrl,
	ClassXhr, ClassFailure,
	singletonEvent
*/

var ClassLoader = (function() {
	function Loader(dependency) {
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
				if(dependency.handler.validate(type)) {
					dependency.source = response;

					singletonEvent.emit(EVENT_POST_REQUEST, dependency.type, dependency);
				} else {
					dependency.deferred.reject(new ClassFailure('error loading (content-type)', dependency.path));
				}
			},
			function(status) {
				dependency.deferred.reject(new ClassFailure('error loading' + (status ? ' (status)' : ''), dependency.path));
			}
		);
	}

	return Loader;
}());