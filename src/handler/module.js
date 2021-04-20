/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID, MODULE_PREFIX_HANDLER, EVENT_POST_CONFIGURE, EVENT_PRE_REQUEST, EVENT_POST_REQUEST, STRING_UNDEFINED, TRUE,
	validatorIsObject,
	functionResolveSourcemaps, functionMerge, functionOnAnimationFrame,
	abstractHandler,
	ClassPledge
*/

//=require constants.js
//=require function/resolveSourcemaps.js
//=require function/merge.js
//=require function/onAnimationFrame.js
//=require abstract/handler.js
//=require class/pledge.js

var handlerModule = (function() {
	var path           = MODULE_PREFIX_HANDLER + 'module',
		target         = document.getElementsByTagName('head')[0],
		regexMatchType = /^(application|text)\/(x-)?javascript/,
		settings       = { umd: false, suffix: '.js' };

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

			if(suffix && dependency.path.indexOf('@') !== 0) {
				pathname = dependency.url.pathname;

				dependency.url.pathname = pathname.slice(-suffix.length) !== suffix ? pathname + suffix : pathname;
			}
		},
		onPostRequest: function(dependency) {
			dependency.source = functionResolveSourcemaps(dependency.url, dependency.source);
		},
		onPreProcess: function(dependency) {
			dependency.enqueue = new ClassPledge(functionOnAnimationFrame.bind(null, demand.idle));
		},
		process: function(dependency) {
			var script, _define;

			if(dependency.source) {
				script       = document.createElement('script');
				script.async = TRUE;
				script.text  = dependency.source;

				script.setAttribute(DEMAND_ID + '-id', dependency.id);

				if(settings.umd) {
					_define       = global.define;
					global.define = provide;
				}

				target.appendChild(script);

				if(settings.umd) {
					global.define = _define;
				}
			}
		}
	};

	return new (HandlerModule.extends(abstractHandler));
}());
