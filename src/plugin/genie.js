/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	MODULE_PREFIX_PLUGIN, MODULE_PREFIX_HANDLER, EVENT_POST_CONFIGURE, EVENT_PRE_RESOLVE, STRING_STRING, ERROR_RESOLVE, FALSE, TRUE,
	regexMatchInternal,
	validatorIsObject, validatorIsTypeOf,
	functionIterate, functionHash,
	ClassDependency, ClassFailure,
	singletonCache
*/

//=require constants.js
//=require variables.js
//=require validator/isTypeOf.js
//=require validator/isObject.js
//=require function/iterate.js
//=require function/hash.js
//=require class/dependency.js
//=require class/failure.js
//=require singleton/cache.js

var pluginGenie = (function() {
	var path    = MODULE_PREFIX_PLUGIN + 'genie',
		pattern = [];

	function matchPattern(path) {
		var i = 0, pointer, match;

		for(; (pointer = pattern[i]); i++) {
			if(path.indexOf(pointer.prefix) === 0 && (!match || pointer.weight > match.weight)) {
				match = pointer;
			}
		}

		return match;
	}

	function generateConfiguration(bundle) {
		var matches       = bundle.matches,
			configuration = { pattern: {}, modules: { '/demand/handler/bundle': {} } },
			i = 0, pointer, dependency;

		configuration.pattern[bundle.id] = bundle.fn(matches);
		configuration.modules[MODULE_PREFIX_HANDLER + 'bundle'][bundle.id] = pointer = [];

		for(; (dependency = matches[i]); i++) {
			pointer.push(dependency.path);
		}

		return configuration;
	}

	function resolveDependencies() {
		var i = 0, dependency;

		for(; (dependency = this[i]); i++) {
			dependency.dfd.resolve(arguments[i]);
		}
	}

	function rejectDependencies() {
		var i = 0, dependency;

		for(; (dependency = this[i]); i++) {
			dependency.dfd.reject(new ClassFailure(ERROR_RESOLVE, dependency.id));
		}
	}

	function addPattern(property, value) {
		pattern.push({ prefix: property, weight: property.length, fn: value });
	}

	function resolveBundles(property, value) {
		var matches = value.matches,
			i = 0, dependency;

		if(matches.length > 1) {
			value.id = path + '/' + functionHash(JSON.stringify(value.matches));

			for(; (dependency = matches[i]); i++) {
				matches[i] = new ClassDependency(dependency.uri);
			}

			demand.configure(generateConfiguration(value));
			demand('bundle!' + value.id)
				.then(
					resolveDependencies.bind(matches),
					rejectDependencies.bind(matches)
				);
		}
	}

	demand
		.on(EVENT_POST_CONFIGURE + ':' + path, function(options) {
			if(validatorIsObject(options)) {
				pattern.length = 0;

				functionIterate(options, addPattern);
			}
		})
		.on(EVENT_PRE_RESOLVE, function(dependencies, context) {
			var bundles = {},
				i = 0, dependency, pattern;

			for(; (dependency = dependencies[i]); i++) {
				if(validatorIsTypeOf(dependency, STRING_STRING) && !regexMatchInternal.test(dependency) && !ClassDependency.get(dependency, context)) {
					dependency = new ClassDependency(dependency, context, FALSE);

					if(dependency.type === 'module' && (pattern = matchPattern(dependency.path)) && !singletonCache.get(dependency)) {
						(bundles[pattern.prefix] || (bundles[pattern.prefix] = { fn: pattern.fn, matches: [] })).matches.push(dependency);
					}
				}
			}

			functionIterate(bundles, resolveBundles);
		});

	return TRUE;
}());
