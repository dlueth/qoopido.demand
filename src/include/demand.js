/* global global, document, demand, provide, settings */
/* global options */

/* constants */
	//=require constants.js
	/* global TRUE, STRING_BOOLEAN, STRING_STRING, STRING_FUNCTION, NULL, EVENT_PRE_CONFIGURE, EVENT_POST_CONFIGURE, EVENT_CACHE_MISS */

/* shortcuts */
	//=require shortcuts.js
	/* global arrayPrototypeSlice */

/* functions */
	//=require function/isTypeOf.js
	//=require function/isObject.js
	//=require function/isPositiveInteger.js
	//=require function/iterate.js
	//=require function/merge.js
	//=require function/resolveUrl.js
	/* global isTypeOf, isObject, isPositiveInteger, iterate, merge, resolveUrl */

/* classes */
	//=require class/pledge.js
	//=require class/dependency.js
	//=require class/pattern.js
	//=require class/loader.js
	//=require class/singleton/event.js
	/* global Pledge, Dependency, Pattern, Loader, event */

var demand = global.demand = (function() {
	function demand() {
		var dependencies = arrayPrototypeSlice.call(arguments),
			context      = this !== global ? this : NULL,
			i = 0, uri;

		for(; (uri = dependencies[i]); i++) {
			dependencies[i] = Dependency.resolve(uri, context).pledge;
		}

		return Pledge.all(dependencies);
	}

	demand.configure = function(options) {
		var cache    = options.cache,
			version  = options.version,
			timeout  = options.timeout,
			lifetime = options.lifetime,
			base     = options.base,
			pattern  = options.pattern,
			modules  = options.modules,
			pointer  = settings.modules,
			temp;

		if(isTypeOf(cache, STRING_BOOLEAN)) {
			settings.cache[''] = { weight: 0, state: cache };
		} else if(isObject(cache)) {
			iterate(cache, function(property, value) {
				settings.cache[property] = { weight: property.length, state: value };
			});
		}

		if(isTypeOf(version, STRING_STRING)) {
			settings.version = version;
		}

		if(isPositiveInteger(timeout)) {
			settings.timeout = Math.min(Math.max(timeout, 2), 12) * 1000;
		}

		if(isPositiveInteger(lifetime) && lifetime > 0) {
			settings.lifetime = lifetime * 1000;
		}

		if(isTypeOf(base, STRING_STRING) && base !== '') {
			settings.pattern.base = new Pattern('', base);
		}

		if(isObject(pattern)) {
			iterate(pattern, function(property, value) {
				property !== 'base' && (settings.pattern[property] = new Pattern(property, value));
			});
		}

		if(isObject(modules)) {
			iterate(modules, function(property, value) {
				temp = pointer[property] = pointer[property] || {};

				event.emit(EVENT_PRE_CONFIGURE, property, temp);

				merge(temp, value);

				event.emit(EVENT_POST_CONFIGURE, property, temp);
			});
		}

		return demand;
	};

	demand.on = function(events, callback) {
		event.on(events, callback);

		return demand;
	};

	demand
		.on(EVENT_CACHE_MISS, function(dependency) {
			new Loader(dependency);
		});
	
	demand.configure({ cache: TRUE, base: '/', pattern: { '/demand': resolveUrl(((options && options.url) || location.href) + '/../').slice(0, -1)} });
	options && options.settings && demand.configure(options.settings);
	
	return demand;
}());