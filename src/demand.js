/**
 * Qoopido demand
 *
 * Promise like module loader (XHR) with localStorage caching
 *
 * Copyright (c) 2016 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

/* global demand */

(function(global, document, configuration, JSON, XHR, arrayPrototype, objectPrototype, undefined) {
	'use strict';
	
	var /** pointer */
			arrayPrototypeSlice     = arrayPrototype.slice,
			objectPrototypeToString = objectPrototype.toString,
			arrayPrototypeConcat    = arrayPrototype.concat,
		/** constants */
			DEMAND_ID               = 'demand',
			PROVIDE_ID              = 'provide',
			PATH_ID                 = 'path',
			MODULE_PREFIX           = '/' + DEMAND_ID + '/',
			MODULE_PREFIX_STORAGE   = MODULE_PREFIX + 'storage/',
			MODULE_PREFIX_HANDLER   = MODULE_PREFIX + 'handler/',
			MODULE_PREFIX_PLUGIN    = MODULE_PREFIX + 'plugin/',
			MODULE_PREFIX_LOCAL     = MODULE_PREFIX + 'local',
			MODULE_PREFIX_PATHS     = MODULE_PREFIX + 'paths',
			MODULE_PREFIX_FUNCTION  = MODULE_PREFIX + 'function/',
			MODULE_PREFIX_VALIDATOR = MODULE_PREFIX + 'validator/',
			STRING_STRING           = 'string',
			STRING_BOOLEAN          = 'boolean',
			STRING_FUNCTION         = 'function',
			NULL                    = null,
			XDR                     = 'XDomainRequest' in global &&  global.XDomainRequest || XHR,
		/** regular expressions */
			regexIsAbsolutePath     = /^\//,
			regexIsAbsoluteUri      = /^(http(s?):)?\/\//i,
			regexMatchTrailingSlash = /(.+)\/$/,
			regexMatchParameter     = /^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/,
			regexMatchRegex         = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
			regexMatchEvent         = /^cache(Miss|Hit|Clear|Exceed)|(pre|post)(Configure.*|Resolve|Request|Process|Cache)$/,
		/** other */
			settings                = { cache: {}, timeout: 8 * 1000, pattern: {}, modules: {}, handler: 'module' },
			resolver                = document.createElement('a'),
			registry                = {},
			mocks                   = {},
			listener                = {},
			regexMatchBaseUrl, queue, storage;
	
	/**
	 * --------------------------------
	 * Functions
	 * --------------------------------
	 */
		//=require function/private.js
		//=require function/public.js
		//=require function/defer.js
	
	/**
	 * --------------------------------
	 * Classes
	 * --------------------------------
	 */
		//=require class/uuid.js
		//=require class/pledge.js
		//=require class/queue.js
		//=require class/pattern.js
		//=require class/loader.js
		//=require class/failure.js
	
	/**
	 * --------------------------------
	 * Demand
	 * --------------------------------
	 */
		function demand() {
			var dependencies = arrayPrototypeSlice.call(arguments),
				context      = this !== window ? this : NULL,
				i = 0, dependency;
			
			emit('preResolve', dependencies, context);
			
			for(; (dependency = dependencies[i]); i++) {
				dependencies[i] = resolveDependency(dependency, context);
			}
			
			emit('postResolve', dependencies, context);
			
			return Pledge.all(dependencies);
		}
		
		demand.configure = function(parameter) {
			var cache    = parameter.cache,
				version  = parameter.version,
				timeout  = parameter.timeout,
				lifetime = parameter.lifetime,
				base     = parameter.base,
				pattern  = parameter.pattern,
				modules  = parameter.modules,
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
					if(property !== MODULE_PREFIX_STORAGE) {
						temp = pointer[property] = pointer[property] || {};

						emit('preConfigure:' + property, temp);

						merge(temp, value);

						emit('postConfigure:' + property, temp);
					}
				});
			}
			
			return demand;
		};
		
		demand.remove = function(path) {
			if(registry[path]) {
				!!registry[path].cache && storage.clean.path(path);
				
				delete registry[path];
				delete mocks[path];
			}
			
			return demand;
		};
		
		demand.on = function(events, callback) {
			var event, pointer;
			
			if(isTypeOf(events, STRING_STRING) && isTypeOf(callback, STRING_FUNCTION)) {
				events = events.split(' ');
				
				while(event = events.shift()) {
					if(regexMatchEvent.test(event)) {
						(listener[event] || (listener[event] = [])).push(callback);
						
						if(event.indexOf('postConfigure:') === 0) {
							pointer = settings.modules[event.substr(14)];
							
							if(pointer !== undefined) {
								callback(pointer);
							}
						}
					}
				}
			}
			
			return demand;
		};
		
		demand.list = function(state) {
			var keys, pledge;
			
			if(state) {
				keys = [];

				iterate(registry, function(property, value) {
					pledge = value.pledge;

					if(pledge.state === state || pledge.cache === state) {
						keys.push(property);
					}
				});
			} else {
				keys = Object.keys(registry);
			}
			
			return keys;
		};

		
	/**
	 * --------------------------------
	 * Provide
	 * --------------------------------
	 */
		function provide() {
			var parameter    = arguments,
				path         = isTypeOf(parameter[0], STRING_STRING) ? parameter[0] : NULL,
				dependencies = isArray(parameter[path ? 1 : 0]) ? parameter[path ? 1 : 0] : NULL,
				definition   = dependencies ? parameter[path ? 2 : 1] : parameter[path ? 1 : 0],
				deferred, pledge, isFunction;
			
			if(!path && queue.current) {
				path = queue.current.path;
				
				//queue.process();
				
				queue.current = NULL;
				
				queue.items > 0 && queue.process();
			}
			
			if(path) {
				path       = resolvePath(path, this);
				deferred   = registry[path] || (registry[path] = Pledge.defer());
				pledge     = deferred.pledge;
				isFunction = isTypeOf(definition, STRING_FUNCTION);
				
				if(pledge.isPending()) {
					if(dependencies) {
						demand
							.apply(path, dependencies)
							.then(
								function() { deferred.resolve(isFunction ? definition.apply(NULL, arguments) : definition); },
								function() { log(new Failure('error providing ' + path)); }
							);
					} else {
						deferred.resolve(isFunction ? definition() : definition);
					}
				}
			} else {
				throw new Failure('unspecified anonymous provide');
			}
		}
	
	/**
	 * --------------------------------
	 * Modules
	 * --------------------------------
	 */
		//=require storage.js
		//=require handler/module.js
		//=require handler/bundle.js
		//=require plugin/genie.js
	
	/**
	 * --------------------------------
	 * Initialization
	 * --------------------------------
	 */
		regexMatchBaseUrl = createRegularExpression('^' + escapeRegularExpression(resolveUrl('/')));
		
		demand.configure({ cache: true, base: '/', pattern: { '/demand': resolveUrl(((configuration && configuration.url) || location.href) + '/../').slice(0, -1)} });
		configuration && configuration.settings && demand.configure(configuration.settings);
		
		assignModule(MODULE_PREFIX_VALIDATOR + 'isArray', isArray);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isObject', isObject);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isTypeOf', isTypeOf);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isInstanceOf', isInstanceOf);
		assignModule(MODULE_PREFIX_VALIDATOR + 'isPositiveInteger', isPositiveInteger);
		assignModule(MODULE_PREFIX_FUNCTION + 'merge', merge);
		assignModule(MODULE_PREFIX_FUNCTION + 'iterate', iterate);
		assignModule(MODULE_PREFIX + 'pledge', Pledge);
		assignModule(MODULE_PREFIX + 'failure', Failure);
		
		queue = new Queue();
		
		global.demand  = demand;
		global.provide = provide;
		
		if(configuration && configuration.main) {
			demand(configuration.main);
		}
}(this, document, 'demand' in this && demand, JSON, XMLHttpRequest, Array.prototype, Object.prototype));