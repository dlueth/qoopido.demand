/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	DEMAND_ID, EVENT_PRE_REQUEST, EVENT_POST_REQUEST, TRUE,
	functionResolveSourcemaps,
	abstractHandler
*/

//=require constants.js
//=require function/resolveSourcemaps.js
//=require abstract/handler.js

var handlerModule = (function() {
	var suffix         = '.js',
		target         = document.getElementsByTagName('head')[0],
		regexMatchType = /^(application|text)\/(x-)?javascript/;

	function HandlerModule() {}

	HandlerModule.prototype = {
		validate: function(type) {
			return regexMatchType.test(type);
		},
		onPreRequest: function(dependency) {
			var pathname = dependency.url.pathname;
			
			dependency.url.pathname = pathname.slice(-suffix.length) !== suffix ? pathname + suffix : pathname;
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