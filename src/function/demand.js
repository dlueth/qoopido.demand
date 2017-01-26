/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	STRING_BOOLEAN, STRING_STRING, EVENT_PRE_RESOLVE, EVENT_POST_RESOLVE, EVENT_PRE_CONFIGURE, EVENT_POST_CONFIGURE, EVENT_CACHE_MISS, EVENT_CACHE_HIT, EVENT_PRE_REQUEST, EVENT_POST_REQUEST, EVENT_PRE_PROCESS, EVENT_POST_PROCESS, NULL, FALSE,
	validatorIsTypeOf, validatorIsObject, validatorIsPositive, validatorIsInstanceOf,
	functionIterate, functionMerge, functionDefer, functionToArray,
	ClassPledge, ClassDependency, ClassPattern, ClassLoader, 
	singletonEvent, singletonCache
*/

//=require constants.js
//=require validator/isTypeOf.js
//=require validator/isObject.js
//=require validator/isPositive.js
//=require validator/isInstanceOf.js
//=require function/iterate.js
//=require function/merge.js
//=require function/defer.js
//=require function/toArray.js
//=require singleton/event.js
//=require singleton/cache.js
//=require class/pledge.js
//=require class/dependency.js
//=require class/pattern.js
//=require class/loader.js

global.demand = (function() {
	function updateCacheSettings(property, value) {
		this[property] = { weight: property.length, state: value };
	}

	function updatePatternSettings(property, value) {
		property !== 'base' && (this[property] = new ClassPattern(property, value));
	}

	function updateModuleSettings(property, value) {
		var temp = this[property] = this[property] || {};

		singletonEvent.emit(EVENT_PRE_CONFIGURE, property, temp);

		functionMerge(temp, value);

		singletonEvent.emit(EVENT_POST_CONFIGURE, property, temp);
	}

	function demand() {
		var dependencies = functionToArray(arguments),
			context      = this !== global ? this : NULL,
			i = 0, uri, dfd, result;
		
		singletonEvent.emit(EVENT_PRE_RESOLVE, NULL, dependencies, context);
		
		for(; (uri = dependencies[i]); i++) {
			if(validatorIsTypeOf(uri, STRING_STRING)) {
				dependencies[i] = ClassDependency.resolve(uri, context).pledge;
			} else {
				dependencies[i] = (dfd = ClassPledge.defer()).pledge;

				dfd.resolve(uri);
			}
		}
		
		if(dependencies.length > 1) {
			result = ClassPledge.all(dependencies);
		} else {
			result = dependencies[0];
		}
		
		return result.always(function() {
			singletonEvent.emit(EVENT_POST_RESOLVE, NULL, dependencies, context);
		});
	}

	demand.configure = function(options) {
		var cache    = options.cache,
			version  = options.version,
			timeout  = options.timeout,
			lifetime = options.lifetime,
			base     = options.base,
			pattern  = options.pattern,
			modules  = options.modules,
			pointer  = settings.modules;

		if(validatorIsTypeOf(cache, STRING_BOOLEAN)) {
			settings.cache[''] = { weight: 0, state: cache };
		} else if(validatorIsObject(cache)) {
			functionIterate(cache, updateCacheSettings, settings.cache);
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
			functionIterate(pattern, updatePatternSettings, settings.pattern);
		}

		if(validatorIsObject(modules)) {
			functionIterate(modules, updateModuleSettings, pointer);
		}

		return demand;
	};

	demand.version = '{{gulp:package.version}}';
	demand.on      = singletonEvent.on.bind(demand);
	demand.remove  = ClassDependency.remove;
	demand.list    = ClassDependency.list;
	demand.clear   = singletonCache.clear;

	singletonEvent
		.after(EVENT_CACHE_MISS, function(dependency) {
			new ClassLoader(dependency);
		})
		.after(EVENT_CACHE_HIT + ' ' + EVENT_POST_REQUEST, function(dependency) {
			singletonEvent.emit(EVENT_PRE_PROCESS, dependency.id, dependency);
		})
		.after(EVENT_PRE_REQUEST, function(dependency) {
			var pointer = dependency.handler.onPreRequest;
	
			pointer && pointer(dependency);
		})
		.after(EVENT_POST_REQUEST, function(dependency) {
			var pointer = dependency.handler.onPostRequest;
	
			pointer && pointer(dependency);
		})
		.after(EVENT_PRE_PROCESS, function(dependency) {
			var pointer = dependency.handler.onPreProcess;
			
			pointer && pointer(dependency);
			
			dependency.pledge.then(function() {
				singletonEvent.emit(EVENT_POST_PROCESS, dependency.id, dependency);
			});

			if(dependency.enqueue === true) {
				queue.enqueue(dependency);
			} else if(validatorIsInstanceOf(dependency.enqueue, ClassPledge)) {
				dependency.enqueue.then(function() { queue.enqueue(dependency); });
			}
		});

	return demand;
}());