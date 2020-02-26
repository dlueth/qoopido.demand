/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID, MODULE_PREFIX_HANDLER, EVENT_POST_CONFIGURE, EVENT_PRE_REQUEST, EVENT_POST_REQUEST, STRING_UNDEFINED, TRUE,
	validatorIsObject,
	functionResolveSourcemaps, functionMerge,
	abstractHandler
*/

//=require constants.js
//=require function/resolveSourcemaps.js
//=require abstract/handler.js

var handlerModule = (function() {
	var path           = MODULE_PREFIX_HANDLER + 'component',
		target         = document.getElementsByTagName('head')[0],
		regexMatchType = /^(application|text)\/(x-)?javascript/,
		settings       = { suffix: '.js' };

	demand
		.on(EVENT_POST_CONFIGURE + ':' + path, function(options) {
			if(validatorIsObject(options)) {
				functionMerge(settings, options);
			}
		});

	function HandlerModule() {}

	HandlerModule.prototype = {
		validate: function(type) {
			return regexMatchType.test(type);
		},
		onPreRequest: function(dependency, suffix) {
			var pathname;

			suffix = (typeof suffix !== STRING_UNDEFINED) ? suffix : settings.suffix;

			if(suffix) {
				pathname = dependency.url.pathname;

				dependency.url.pathname = pathname.slice(-suffix.length) !== suffix ? pathname + suffix : pathname;
			}
		},
		onPostRequest: function(dependency) {
			dependency.source = functionResolveSourcemaps(dependency.url, dependency.source);
		},
		process: function(dependency) {
			var script;

			if(dependency.source) {
				script       = document.createElement('script');
				script.async = TRUE;
				script.text  = dependency.source;

				script.setAttribute(DEMAND_ID + '-id', dependency.id);

				target.appendChild(script);
			}
		}
	};

	return new (HandlerModule.extends(abstractHandler));
}());
