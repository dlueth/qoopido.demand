/* global
	global, document, demand, provide, queue, processor, settings,
	STRING_BOOLEAN, STRING_STRING, EVENT_PRE_CONFIGURE, EVENT_POST_CONFIGURE, EVENT_CACHE_MISS, EVENT_CACHE_HIT, EVENT_PRE_REQUEST, EVENT_POST_REQUEST, EVENT_PRE_PROCESS, NULL,
	arrayPrototypeSlice,
	validatorIsTypeOf, validatorIsObject, validatorIsPositive,
	functionIterate, functionMerge, functionDefer,
	ClassPledge, ClassDependency, ClassPattern, ClassLoader, 
	singletonEvent, singletonCache
*/

//=require constants.js
//=require shortcuts.js
//=require validator/isTypeOf.js
//=require validator/isObject.js
//=require validator/isPositive.js
//=require function/iterate.js
//=require function/merge.js
//=require function/defer.js
//=require singleton/event.js
//=require singleton/cache.js
//=require class/pledge.js
//=require class/dependency.js
//=require class/pattern.js
//=require class/loader.js

var demand = global.demand = (function() {
	function demand() {
		var dependencies = arrayPrototypeSlice.call(arguments),
			context      = this !== global ? this : NULL,
			i = 0, uri;

		for(; (uri = dependencies[i]); i++) {
			dependencies[i] = ClassDependency.resolve(uri, context).pledge;
		}

		return ClassPledge.all(dependencies);
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

		if(validatorIsTypeOf(cache, STRING_BOOLEAN)) {
			settings.cache[''] = { weight: 0, state: cache };
		} else if(validatorIsObject(cache)) {
			functionIterate(cache, function(property, value) {
				settings.cache[property] = { weight: property.length, state: value };
			});
		}

		if(validatorIsTypeOf(version, STRING_STRING)) {
			settings.version = version;
		}

		if(validatorIsPositive(timeout)) {
			settings.timeout = Math.min(Math.max(timeout, 2), 12) * 1000;
		}

		if(validatorIsPositive(lifetime) && lifetime > 0) {
			settings.lifetime = lifetime * 1000;
		}

		if(validatorIsTypeOf(base, STRING_STRING) && base !== '') {
			settings.pattern.base = new ClassPattern('', base);
		}

		if(validatorIsObject(pattern)) {
			functionIterate(pattern, function(property, value) {
				property !== 'base' && (settings.pattern[property] = new ClassPattern(property, value));
			});
		}

		if(validatorIsObject(modules)) {
			functionIterate(modules, function(property, value) {
				temp = pointer[property] = pointer[property] || {};

				singletonEvent.emit(EVENT_PRE_CONFIGURE, property, temp);

				functionMerge(temp, value);

				singletonEvent.emit(EVENT_POST_CONFIGURE, property, temp);
			});
		}

		return demand;
	};

	demand.on    = singletonEvent.on.bind(demand);
	demand.list  = ClassDependency.list;
	demand.clear = singletonCache.clear;

	demand
		.on(EVENT_CACHE_MISS, function(dependency) {
			functionDefer(function() {
				new ClassLoader(dependency);
			});
		})
		.on(EVENT_CACHE_HIT + ' ' + EVENT_POST_REQUEST, function(dependency) {
			functionDefer(function() {
				singletonEvent.emit(EVENT_PRE_PROCESS, NULL, dependency)
			});
		})
		.on(EVENT_PRE_REQUEST, function(dependency) {
			var pointer = dependency.handler.onPreRequest;

			pointer && pointer.call(dependency);
		})
		.on(EVENT_POST_REQUEST, function(dependency) {
			var pointer = dependency.handler.onPostRequest;

			pointer && pointer.call(dependency);
		})
		.on(EVENT_PRE_PROCESS, function(dependency) {
			var callback = functionDefer.bind(NULL, function() {
				queue.enqueue(dependency);
			});

			if(dependency.lock) {
				dependency.lock.then(callback);
			} else {
				callback();
			}

		});

	return demand;
}());