/* global global, document, demand, provide, settings */

/* constants */
	//=require constants.js
	/* global MODULE_PREFIX_HANDLER, NULL, EVENT_PRE_REQUEST, EVENT_POST_REQUEST */

/* variables */
	//=require variables.js
	/* global regexIsAbsoluteUri */

/* functions */
	//=require function/iterate.js
	//=require function/resolveUrl.js
	/* global iterate, resolveUrl */

/* classes */
	//=require class/xhr.js
	//=require class/failure.js
	//=require class/singleton/event.js
	/* global Xhr, Failure, event */

var Loader = (function() {
	function Loader(dependency) {
		var self = this,
			pattern;

		if(!regexIsAbsoluteUri.test(dependency.path)) {
			iterate(settings.pattern, function(property, value) {
				value.matches(dependency.path) && (!pattern || pattern.weight < value.weight) && (pattern = value);
			});
		}

		self.dependency = dependency;
		self.url        = pattern ? resolveUrl(pattern.process(dependency.path)) : dependency.path;
		
		demand(MODULE_PREFIX_HANDLER + dependency.handler)
			.then(
				function(handler) {
					//dependency.handler = handler;
					//dependency.mock    = self.mock && mocks[dependency.path];
					
					if(!self.mock) {
						event.emit(EVENT_PRE_REQUEST, dependency.handler, self);
						
						new Xhr(self.url).then(
							function(response, type) {
								if(handler.validate(type)) {
									self.source = response;
									
									event.emit(EVENT_POST_REQUEST, dependency.handler, self);
								} else {
									dependency.deferred.reject(new Failure('error loading (content-type)', self.path));
								}
							},
							function(status) {
								dependency.deferred.reject(new Failure('error loading' + (status ? ' (status)' : ''), self.path));
							}
						);
					}
				},
				function() {

				}
			);
	}

	/* only for reference
	Loader.prototype = {
		dependency: NULL,
	 	url:        NULL,
	 	source:     NULL
	};
	*/

	return Loader;
}());