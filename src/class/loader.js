/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID, EVENT_PRE_REQUEST, EVENT_POST_REQUEST, ERROR_LOAD,
	regexIsAbsoluteUri,
	linkElement,
	functionIterate, functionResolveUrl, functionGetTimestamp,
	ClassXhr, ClassFailure,
	singletonEvent
*/

//=require constants.js
//=require variables.js
//=require shortcuts.js
//=require function/resolveUrl.js
//=require function/iterate.js
//=require singleton/event.js
//=require class/xhr.js
//=require class/failure.js

function ClassLoader(dependency) {
	var regexMatchEmptySearch   = /^(?:\?|)$/,
		pattern;

	function resolve(response, type) {
		if(!type || !dependency.handler.validate || dependency.handler.validate(type)) {
			dependency.source = response;

			singletonEvent.emit(EVENT_POST_REQUEST, dependency.type, dependency);
		} else {
			dependency.dfd.reject(new ClassFailure(ERROR_LOAD + ' (content-type)', dependency.id));
		}
	}

	function reject(status) {
		dependency.dfd.reject(new ClassFailure(ERROR_LOAD + (status ? ' (status)' : ''), dependency.id));
	}

	function load(location) {
		location       = location || 0;
		dependency.url = document.createElement('a');

		dependency.url.href    = pattern ? functionResolveUrl(pattern.process(dependency.path, location)) : dependency.path;

		if(dependency.invalid) {
			dependency.url.search += ((regexMatchEmptySearch.test(dependency.url.search)) ? '' : '&') + functionGetTimestamp();
		}

		singletonEvent.emit(EVENT_PRE_REQUEST, dependency.type, dependency);

		new ClassXhr(dependency.url).then(
			resolve,
			(
				pattern ?
				function() {
					location++;

					if(pattern.location[location]) {
						load(location);
					} else {
						reject();
					}
				}
				:
				reject
			)
		);
	}

	if(!regexIsAbsoluteUri.test(dependency.path)) {
		functionIterate(settings.pattern, function(property, value) {
			value.matches(dependency.path) && (!pattern || pattern.weight < value.weight) && (pattern = value);
		});
	}

	load();
}
