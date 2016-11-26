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

(function(global, document, configuration, JSON, arrayPrototype, objectPrototype, setTimeout, undefined) {
	'use strict';

	var /** shortcuts */
			arrayPrototypeSlice     = arrayPrototype.slice,
			arrayPrototypeConcat    = arrayPrototype.concat,
			objectPrototypeToString = objectPrototype.toString,
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
		/** regular expressions */
			regexIsAbsolutePath     = /^\//,
			regexIsAbsoluteUri      = /^(http(s?):)?\/\//i,
			regexMatchParameter     = /^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/,
			regexMatchRegex         = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
			regexMatchEvent         = /^cache(Miss|Hit|Clear|Exceed)|(pre|post)(Configure.*|Resolve|Request|Process|Cache)$/,
			regexMatchBaseUrl,
		/** classes */
			Uuid, Pledge, Queue, QueueHandler, Pattern, Xhr, Loader, Failure,
		/** instances */
			queue, queueHandler, storage,
		/** conditional functions */
			defer,
		/** other */
			settings                = { cache: {}, timeout: 8 * 1000, pattern: {}, modules: {}, handler: 'module' },
			resolver                = document.createElement('a'),
			registry                = {},
			mocks                   = {},
			listener                = {}
			;

	/**
	 * --------------------------------
	 * Functions
	 * --------------------------------
	 */
		/**
		 * Private
		 */
			function emit(event) {
				var pointer = listener[event],
					parameter, i, callback;

				if(pointer) {
					parameter = arrayPrototypeSlice.call(arguments, 1);

					for(i = 0; (callback = pointer[i]); i++) {
						callback.apply(NULL, parameter);
					}
				}
			}

			function log(error) {
				/* eslint-disable no-console */
				if(!isTypeOf(console, 'undefined')) {
					console.error(error.toString());
				}
				/* eslint-enable no-console */
			}

			function mockModules() {
				var pledges = [],
					i = 0, module, pledge, parameter;

				for(; (module = arguments[i]); i++) {
					parameter    = module.match(regexMatchParameter);
					module       = module.replace(regexMatchParameter, '');
					pledge       = (mocks[module] || (mocks[module] = Pledge.defer())).pledge;
					arguments[i] = (parameter ? 'mock:' + parameter.slice(1).join('')  : 'mock:') + '!' + module;

					pledges.push(pledge);
				}

				demand.apply(NULL, arguments);

				return Pledge.all(pledges);
			}

			function escapeRegularExpression(value) {
				return value.replace(regexMatchRegex, '\\$&');
			}

			function createRegularExpression(expression, modifier) {
				return new RegExp(expression, modifier);
			}

			function getTimestamp() {
				return +new Date();
			}

			function resolveUrl(url) {
				resolver.href = url;

				return resolver.href;
			}

			function resolvePath(path, context) {
				path = path.replace(regexMatchParameter, '');

				if(!regexIsAbsolutePath.test(path) && !regexIsAbsoluteUri.test(path)) {
					path = '/' + resolveUrl(((context && resolveUrl(context + '/../')) || '/') + path).replace(regexMatchBaseUrl, '');
				}

				return path;
			}

			function resolveDependency(dependency, context) {
				var path, definition, deferred;

				if(isTypeOf(dependency, STRING_STRING)) {
					path = resolvePath(dependency, context);

					if(context && (dependency === DEMAND_ID || dependency === PROVIDE_ID || dependency === PATH_ID)) {
						switch(dependency) {
							case DEMAND_ID:
								path       = MODULE_PREFIX_LOCAL + path;
								definition = function() {
									var scopedDemand = demand.bind(context);

									iterate(demand, function(property, value) {
										scopedDemand[property] = value;
									});

									return scopedDemand;
								};

								break;
							case PROVIDE_ID:
								path       = MODULE_PREFIX_LOCAL + path;
								definition = function() {
									return provide.bind(context);
								};

								break;
							case PATH_ID:
								path       = MODULE_PREFIX_PATHS + context;
								definition = function() {
									return context;
								};

								break;
						}

						!registry[path] && provide(path, definition);
					}

					return (registry[path] || (registry[path] = new Loader(path, resolveParameter(dependency, context)))).pledge;
				} else {
					if(!isInstanceOf(dependency, Pledge)) {
						deferred = Pledge.defer();

						deferred.resolve(dependency);

						return deferred.pledge;
					} else {
						return dependency;
					}
				}
			}

			function resolveParameter(path, context) {
				var parameter = path.match(regexMatchParameter),
					pattern   = settings.pattern,
					match;

				path = resolvePath(path, context);

				if(!regexIsAbsoluteUri.test(path)) {
					iterate(pattern, function(property, value) {
						value.matches(path) && (!match || match.weight < value.weight) && (match = value);
					});
				}

				return {
					mock:     (parameter && parameter[1]) ? true : false,
					cache:    (parameter && parameter[2]) ? parameter[2] === '+' : NULL,
					handler:  (parameter && parameter[3]) || settings.handler,
					version:  (parameter && parameter[4]) || settings.version,
					lifetime: (parameter && parameter[5] && parameter[5] * 1000) || settings.lifetime,
					url:      match ? resolveUrl(match.process(path)) : path
				};
			}

			function mergeProperties(property, value) {
				var targetProperty = this[property],
					targetPropertyIsObject;

				if(value !== undefined) {
					if(isObject(value)) {
						targetPropertyIsObject = isObject(targetProperty);

						if(value.length !== undefined) {
							targetProperty = (targetPropertyIsObject && targetProperty.length !== undefined) ? targetProperty : [];
						} else {
							targetProperty = (targetPropertyIsObject && targetProperty.length === undefined) ? targetProperty : {};
						}

						this[property] = merge(targetProperty, value);
					} else {
						this[property] = value;
					}
				}
			}

		/**
		 * Public
		 */
			/**
			 * isArray
			 *
			 * Check whether a given value is of type array
			 *
			 * @param value
			 *
			 * @return {boolean}
			 */
			function isArray(value) {
				return objectPrototypeToString.call(value) === '[object Array]';
			}

			/**
			 * isObject
			 *
			 * Check whether a given object is of type object
			 *
			 * @param object
			 *
			 * @return {boolean}
			 */
			function isObject(object) {
				return object && isTypeOf(object, 'object');
			}

			/**
			 * isTypeOf
			 *
			 * Check whether a given object is of specified type
			 *
			 * @param object
			 * @param {string} type
			 *
			 * @return {boolean}
			 */
			function isTypeOf(object, type) {
				return typeof object === type;
			}

			/**
			 * isInstanceOf
			 *
			 * Check whether a given object is an instance of specified type
			 *
			 * @param object
			 * @param module
			 *
			 * @return {boolean}
			 */
			function isInstanceOf(object, module) {
				return object instanceof module;
			}

			/**
			 * isPositiveInteger
			 *
			 * Check whether a given value is a positive integer
			 *
			 * @param value
			 *
			 * @return {boolean}
			 */
			function isPositiveInteger(value) {
				return isTypeOf(value, 'number') && isFinite(value) && Math.floor(value) === value && value >= 0;
			}

			/**
			 * merge
			 *
			 * Merge two or more objects into the first one passed in
			 *
			 * @param {...object} object
			 *
			 * @return {object}
			 */
			function merge() {
				var target = arguments[0],
					i = 1, properties;

				for(; (properties = arguments[i]) !== undefined; i++) {
					iterate(properties, mergeProperties, target);
				}

				return target;
			}

			/**
			 * iterate
			 *
			 * Iterate over enumerable & own properties of a given
			 * object and pass current property as well as its value
			 * to a callback function
			 *
			 * @param {object} object
			 * @param {function} callback
			 * @param context
			 *
			 * @return {object}
			 */
			function iterate(object, callback, context) {
				var properties = Object.keys(object),
					i = 0, property;

				for(; (property = properties[i]) !== undefined; i++) {
					if(callback.call(context, property, object[property]) === false) {
						break;
					}
				}
			}

			/**
			 * hash
			 *
			 * Generate a hash for a given string
			 *
			 * @param {string} input
			 *
			 * @return {number}
			 */
			function hash(input){
				var value = 5381,
					i     = input.length;

				while(i) {
					value = (value * 33) ^ input.charCodeAt(--i);
				}

				return value >>> 0;
			}

			/**
			 * defer
			 *
			 * delay function execution like setImmediate does
			 *
			 * @param {function} function
			 */
			defer = (function() {
				var hasSetImmediate = 'setImmediate' in global,
					element, fallback;

				if('MutationObserver' in global) {
					return function(fn) {
						element = document.createElement('div');

						new MutationObserver(function() { fn(); })
							.observe(element, { attributes: true });

						element.setAttribute('i', '1');
					};
				}

				if(!hasSetImmediate && 'postMessage' in global && !('importScripts' in global) && 'addEventListener' in global) {
					return (function() {
						var storage = {};

						function onMessage(event) {
							if(event.source === global && event.data && storage[event.data]) {
								storage[event.data]();
								
								delete storage[event.data];
							}
						}

						global.addEventListener('message', onMessage, false);

						return function(fn) {
							var uuid = Uuid.generate();

							storage[uuid] = fn;

							global.postMessage(uuid, '*');
						}
					}());
				}

				if(!hasSetImmediate && 'onreadystatechange' in (element = document.createElement('script'))) {
					return function(fn) {
						element.onreadystatechange = function onreadystatechange() {
							element.onreadystatechange = NULL;
							element.parentNode.removeChild(element);

							fn();
						};

						document.body.appendChild(element);
					};
				}

				/* eslint-disable no-undef */
				fallback = hasSetImmediate ? setImmediate : setTimeout;
				/* eslint-enable no-undef */

				return function(fn) {
					fallback(fn);
				}
			}());
	
	/**
	 * --------------------------------
	 * Classes
	 * --------------------------------
	 */
		/**
		 * Uuid
		 */
			Uuid = (function() {
				var objectDefineProperty = Object.defineProperty,
					regex                = new RegExp('[xy]', 'g'),
					storage              = {};

				function randomize(character) {
					var r = Math.random() * 16 | 0;

					return ((character === 'x') ? r : (r & 0x3 | 0x8)).toString(16);
				}

				function Uuid() {}

				Uuid.prototype = {
					generate: function() {
						var result;

						do {
							result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regex, randomize);
						} while(storage[result]);

						storage[result] = 1;

						return result;
					},
					set: function(target) {
						if(typeof target.uuid === 'undefined') {
							objectDefineProperty(target, 'uuid', {
								__proto__:    NULL,
								value:        this.generate(),
								enumerable:   false,
								configurable: false,
								writable:     false
							});
						}

						return target.uuid;
					}
				};

				return new Uuid();
			}());

		/**
		 * Pledge
		 */
			Pledge = (function() {
				var PLEDGE_PENDING  = 'pending',
					PLEDGE_RESOLVED = 'resolved',
					PLEDGE_REJECTED = 'rejected',
					fn              = function() {},
					storage         = {};

				function resolve() {
					storage[this.uuid].handle(PLEDGE_RESOLVED, arguments);
				}

				function reject() {
					storage[this.uuid].handle(PLEDGE_REJECTED, arguments);
				}

				function handle(state, parameter) {
					var self     = this,
						listener = storage[self.uuid],
						pointer, result;

					if(self.state === PLEDGE_PENDING) {
						self.state = state;
						self.value = parameter;
					}

					while(pointer = listener[self.state].shift()) {
						result = pointer.handler.apply(NULL, self.value);

						if(result && typeof result.then === 'function') {
							result.then(pointer.deferred.resolve, pointer.deferred.reject);
						} else {
							pointer.deferred[self.state === PLEDGE_RESOLVED ? 'resolve' : 'reject'].apply(NULL, self.value);
						}
					}

					listener[PLEDGE_RESOLVED].length = 0;
					listener[PLEDGE_REJECTED].length = 0;
				}

				function observe(pledge, index, properties) {
					pledge.then(
						function() {
							properties.resolved[index] = arrayPrototypeSlice.call(arguments);

							properties.count++;

							check(properties);
						},
						function() {
							properties.rejected.push(arrayPrototypeSlice.call(arguments));

							check(properties);
						}
					);
				}

				function check(properties) {
					if(properties.count === properties.total) {
						properties.deferred.resolve.apply(NULL, arrayPrototypeConcat.apply([], properties.resolved));
					} else if(properties.rejected.length + properties.count === properties.total) {
						properties.deferred.reject.apply(NULL, arrayPrototypeConcat.apply([], properties.rejected));
					}
				}

				function Pledge(executor) {
					var self = this;

					storage[Uuid.set(self)] = { handle: handle.bind(self), resolved: [], rejected: [] };

					executor(resolve.bind(self), reject.bind(self));
				}

				Pledge.prototype = {
					/* only for reference
					 uuid:   NULL,
					 value:  NULL,
					 cache:  NULL, // will only be set by storage
					 */
					state:  PLEDGE_PENDING,
					'catch': function(listener) {
						return this.then(fn, listener);
					},
					always: function(alwaysListener) {
						return this.then(alwaysListener, alwaysListener);
					},
					then: function(resolveListener, rejectListener) {
						var self       = this,
							properties = storage[self.uuid],
							deferred   = Pledge.defer();

						resolveListener && properties[PLEDGE_RESOLVED].push({ handler: resolveListener, deferred: deferred });
						rejectListener && properties[PLEDGE_REJECTED].push({ handler: rejectListener, deferred: deferred });

						if(self.state !== PLEDGE_PENDING) {
							defer(properties.handle);
						}

						return deferred.pledge;
					},
					isPending: function() {
						return this.state === PLEDGE_PENDING;
					},
					isResolved: function() {
						return this.state === PLEDGE_RESOLVED;
					},
					isRejected: function() {
						return this.state === PLEDGE_REJECTED;
					}
				};

				Pledge.defer = function() {
					var self = {};

					self.pledge = new Pledge(function(resolveListener, rejectListener) {
						self.resolve = resolveListener;
						self.reject  = rejectListener;
					});

					return self;
				};

				Pledge.all = function(pledges) {
					var deferred   = Pledge.defer(),
						properties = (storage[Uuid.generate()] = { deferred: deferred, resolved: [], rejected: [], total: pledges.length, count: 0 }),
						i = 0, pledge;

					for(; pledge = pledges[i]; i++) {
						observe(pledge, i, properties)
					}

					return deferred.pledge;
				};

				Pledge.race = function(pledges) {
					var deferred = Pledge.defer(),
						i = 0, pledge;

					for(; pledge = pledges[i]; i++) {
						pledge.then(deferred.resolve, deferred.reject);
					}

					return deferred.pledge;
				};

				return Pledge;
			}());

		/**
		 * Queue
		 */
			Queue = (function() {
				var storage = {};

				function Queue() {
					Uuid.set(this);

					storage[this.uuid] = [];
					
					global.queue = storage[this.uuid];
				}

				Queue.prototype = {
					/* only for reference
					 uuid: NULL,
					 */
					enqueue: function() {
						storage[this.uuid] = storage[this.uuid].concat(arrayPrototypeSlice.call(arguments));
					},
					dequeue: function() {
						return storage[this.uuid].shift();
					},
					get current() {
						return storage[this.uuid][0];
					},
					get length() {
						return storage[this.uuid].length;
					}
				};

				return Queue;
			}());

		/**
		 * QueueHandler
		 */
			QueueHandler = (function() {
				var storage = {};

				function QueueHandler(queue) {
					Uuid.set(this);

					storage[this.uuid] = { queue: queue, current: NULL };
				}

				QueueHandler.prototype = {
					process: function() {
						var properties = storage[this.uuid],
							queue      = properties.queue,
							current;

						if(queue.length) {
							current = properties.current = queue.dequeue();

							current.handler.process.call(current);
							emit('postProcess', current);
						} else {
							properties.current = NULL;
						}
					},
					get current() {
						return storage[this.uuid].current;
					}
				};

				return QueueHandler;
			}());

		/**
		 * Pattern
		 */
			Pattern = (function() {
				var regexMatchTrailingSlash = /(.+)\/$/;

				function Pattern(pattern, url) {
					var self = this;

					self.weight       = pattern.length;
					self.url          = resolveUrl(url).replace(regexMatchTrailingSlash, '$1');
					self.matchPattern = createRegularExpression('^' + escapeRegularExpression(pattern));
					self.matchUrl     = createRegularExpression('^' + escapeRegularExpression(url));
				}

				Pattern.prototype = {
					/* only for reference
					 weight:       0,
					 url:          NULL,
					 matchPattern: NULL,
					 matchUrl:     NULL,
					 */
					matches: function(path) {
						return this.matchPattern.test(path);
					},
					remove: function(url) {
						return url.replace(this.matchUrl, '');
					},
					process: function(path) {
						return path.replace(this.matchPattern, this.url);
					}
				};

				return Pattern;
			}());

		/**
		 * Xhr
		 */
		Xhr = (function(XMLHttpRequest) {
			var XDomainRequest = 'XDomainRequest' in global && global.XDomainRequest || XMLHttpRequest;

			function checkState() {
				if(this.readyState < 4) {
					this.abort();
				}
			}

			return function Xhr(url) {
				var boundCheckState = checkState.bind(this),
					deferred        = Pledge.defer(),
					xhr             = regexMatchBaseUrl.test(url) ? new XMLHttpRequest() : new XDomainRequest(),
					timeout         = settings.timeout,
					pointer;
				
				xhr.ontimeout = xhr.onerror = xhr.onabort = function() {
					deferred.reject(xhr.status);
				};
				xhr.onprogress = xhr.onreadystatechange = function() {
					clearTimeout(pointer);

					pointer = setTimeout(boundCheckState, settings.timeout);
				};
				xhr.onload = function() {
					timeout = clearTimeout(timeout);

					if(!('status' in xhr) || xhr.status === 200) {
						deferred.resolve(xhr.responseText, xhr.getResponseHeader && xhr.getResponseHeader('content-type'));
					} else {
						deferred.reject(xhr.status);
					}
				};

				xhr.open('GET', url, true);
				setTimeout(function() {
					xhr.send();
				});

				pointer = setTimeout(boundCheckState, settings.timeout);

				return deferred.pledge;
			}
		}(XMLHttpRequest));

		/**
		 * Loader
		 */
			Loader = (function() {
				function resolveLoader(loader) {
					var handler = loader.handler;

					emit('preProcess', loader);

					if(loader.deferred.pledge.isPending()) {
						handler.onPreProcess && handler.onPreProcess.call(loader);
						handler.process && queue.enqueue(loader);
						
						!queueHandler.current && queueHandler.process();
					}
				}

				function Loader(path, parameter) {
					var self     = this,
						deferred = Pledge.defer(),
						pledge   = deferred.pledge,
						handler  = parameter.handler;

					self.deferred = deferred;
					self.path     = path;
					self.url      = parameter.url;
					self.cache    = parameter.cache;
					self.version  = parameter.version;
					self.lifetime = parameter.lifetime;

					demand(MODULE_PREFIX_HANDLER + handler)
						.then(
							function(handler) {
								self.handler = handler;
								self.mock    = parameter.mock ? mocks[self.path] : NULL;

								handler.onPreRequest && handler.onPreRequest.call(self);

								if(!self.mock) {
									if(self.cache === false || !storage.get(self)) {
										emit('preRequest', self);

										new Xhr(self.url).then(
											function(response, type) {
												if(!type || !handler.matchType || handler.matchType.test(type)) {
													self.source = response;

													emit('postRequest', self);

													handler.onPostRequest && handler.onPostRequest.call(self);
													resolveLoader(self);

													if(self.cache !== false) {
														pledge.then(function() { storage.set(self); });
													}
												} else {
													deferred.reject(new Failure('error loading (content-type)', self.path));
												}
											},
											function(status) {
												deferred.reject(new Failure('error loading' + (status ? ' (status)' : ''), self.path));
											}
										);

									} else {
										resolveLoader(self);
									}
								} else {
									if(self.mock.dependencies) {
										self.mock.dependencies.then(
											function() {
												self.mock.resolve(self);
											},
											self.mock.reject
										);
									} else {
										self.mock.resolve(self);
									}
								}
							},
							deferred.reject
						);

					return deferred;
				}

				/* only for reference
				 Loader.prototype = {
					 deferred: NULL,
					 path:     NULL,
					 url:      NULL,
					 handler:  NULL,
					 source:   NULL,
					 mock:     NULL,
					 cache:    NULL,
					 lifetime: NULL,
					 version:  NULL,
					 state:    { version: NULL, expires: NULL, url: NULL } // will only be set by storage
				 };
				 */

				return Loader;
			}());

		/**
		 * Failure
		 */
			Failure = (function() {
				function Failure(message, module, stack) {
					this.message = message;

					module && (this.module = module);
					stack && (this.stack = arrayPrototypeSlice.call(stack));
				}

				Failure.prototype = {
					/* only for reference
					 message: NULL,
					 module:  NULL,
					 stack:   NULL,
					 */
					toString: function() {
						var self   = this,
							result = DEMAND_ID + ': ' + self.message + ' ' + (self.module ? '"' + self.module + '"' : '');

						if(self.stack) {
							result = Failure.traverse(self.stack, result, 1);
						}

						return result;
					}
				};

				Failure.traverse = function(stack, value, depth) {
					var indention = new Array(depth + 1).join(' '),
						i = 0, item;

					for(; item = stack[i]; i++) {
						value += '\n' + indention + '> ' + item.message + ' ' + (item.module ? '"' + item.module + '"' : '');

						if(item.stack) {
							value = Failure.traverse(item.stack, value, depth + 1);
						}
					}

					return value;
				};

				return Failure;
			}());
	
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

			if(!path && queueHandler.current) {
				path = queueHandler.current.path;

				queueHandler.process();
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
								function() { log(new Failure('error providing', path)); }
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
		/**
		 * /demand/storage
		 */
			(function(){
				function definition() {
					var STORAGE_PREFIX       = '[' + DEMAND_ID + ']',
						STORAGE_SUFFIX_STATE = '[state]',
						STORAGE_SUFFIX_VALUE = '[value]',
						regexMatchState      = createRegularExpression('^' + escapeRegularExpression(STORAGE_PREFIX) + '\\[(.+?)\\]' + escapeRegularExpression(STORAGE_SUFFIX_STATE) + '$'),
						localStorage         = (function() { try { return 'localStorage' in global && global.localStorage; } catch(exception) { return false; } }()),
						hasRemainingSpace    = localStorage && 'remainingSpace' in localStorage;

					function isEnabled(loader) {
						var match;

						if(loader.cache !== NULL) {
							return loader.cache;
						}

						iterate(settings.cache, function(property, value) {
							if(loader.path.indexOf(property) === 0 && (!match || value.weight > match.weight)) {
								match = value;
							}
						});

						return match ? match.state : false;
					}

					function Storage() {
						this.clear.expired();
					}

					Storage.prototype = {
						get: function(loader) {
							var path = loader.path,
								id, state, pledge;

							if(localStorage && isEnabled(loader)) {
								id     = STORAGE_PREFIX + '[' + path + ']';
								state  = JSON.parse(localStorage.getItem(id + STORAGE_SUFFIX_STATE));
								pledge = loader.deferred.pledge;

								if(state && state.version === loader.version && state.url === loader.url && ((!state.expires && !loader.lifetime) || state.expires > getTimestamp())) {
									pledge.cache  = 'hit';
									loader.source = localStorage.getItem(id + STORAGE_SUFFIX_VALUE);

									emit('cacheHit', loader);

									return loader.source;
								} else {
									pledge.cache = 'miss';

									emit('cacheMiss', loader);
									this.clear.path(path);
								}
							}
						},
						set: function(loader) {
							var path = loader.path,
								lifetime, id, spaceBefore;

							if(localStorage && isEnabled(loader)) {
								emit('preCache', loader);

								lifetime = loader.lifetime;
								id       = STORAGE_PREFIX + '[' + path + ']';

								loader.state = { version: loader.version, expires: lifetime ? getTimestamp() + lifetime : lifetime, url: loader.url };

								try {
									spaceBefore = hasRemainingSpace ? localStorage.remainingSpace : NULL;

									localStorage.setItem(id + STORAGE_SUFFIX_VALUE, loader.source);
									localStorage.setItem(id + STORAGE_SUFFIX_STATE, JSON.stringify(loader.state));

									// strict equality check with "===" is required due to spaceBefore might be "0"
									if(spaceBefore !== NULL && localStorage.remainingSpace === spaceBefore) {
										throw new Error('QUOTA_EXCEEDED_ERR');
									}

									emit('postCache', loader);
								} catch(error) {
									emit('cacheExceed', loader);
								}
							}
						},
						clear: {
							path: function(path) {
								var id;

								if(localStorage) {
									id = STORAGE_PREFIX + '[' + path + ']';

									localStorage.removeItem(id + STORAGE_SUFFIX_STATE);
									localStorage.removeItem(id + STORAGE_SUFFIX_VALUE);

									emit('cacheClear', path);
								}
							},
							all: function() {
								var match;

								if(localStorage) {
									iterate(localStorage, function(property) {
										match = property.match(regexMatchState);

										match && this.path(match[1]);
									}, this);
								}
							},
							expired: function() {
								var match, state;

								if(localStorage) {
									iterate(localStorage, function(property) {
										match = property.match(regexMatchState);

										if(match) {
											state = JSON.parse(localStorage.getItem(STORAGE_PREFIX + '[' + match[1] + ']' + STORAGE_SUFFIX_STATE));

											if(state && state.expires > 0 && state.expires <= getTimestamp()) {
												this.path(match[1]);
											}
										}
									}, this);
								}
							}
						}
					};

					demand.clear = (storage = new Storage()).clear;

					return storage;
				}

				provide(MODULE_PREFIX_STORAGE, definition);
			}());

		/**
		 * /demand/handler/module
		 */
			(function() {
				function definition() {
					var target              = document.getElementsByTagName('head')[0],
						regexMatchSourcemap = /\/\/#\s+sourceMappingURL\s*=\s*(?!(?:http[s]?:)?\/\/)(.+?)\.map/g;

					return {
						matchType: /^(application|text)\/(x-)?javascript/,
						onPreRequest: function() {
							var url  = this.url;

							this.url = url.slice(-3) !== '.js' ? url + '.js' : url;
						},
						onPostRequest: function() {
							var self   = this,
								source = self.source,
								match, replacement;

							if(source) {
								while(match = regexMatchSourcemap.exec(source)) {
									if(regexIsAbsolutePath.test(match[1])) {
										resolver.href = self.url;

										replacement = resolver.protocol + '//' + resolver.host + match[1];
									} else {
										replacement = resolveUrl(self.url + '/../' + match[1]);
									}

									source = source.replace(match[0], '//# sourceMappingURL=' + replacement + '.map');
								}

								self.source = source;
							}
						},
						process: function() {
							var source = this.source,
								script;

							if(source) {
								script       = document.createElement('script');
								script.async = true;
								script.text  = source;

								script.setAttribute('demand-path', this.path);

								target.appendChild(script);
							}
						}
					};
				}

				provide(MODULE_PREFIX_HANDLER + 'module', definition);
			}());

		/**
		 * /demand/handler/bundle
		 */
			(function() {
				var path = MODULE_PREFIX_HANDLER + 'bundle',
					settings;

				function definition(handlerModule) {
					function onPostConfigure(options) {
						settings = isObject(options) ? options : {};
					}

					demand.on('postConfigure:' + path, onPostConfigure);

					return {
						matchType:     handlerModule.matchType,
						onPostRequest: handlerModule.onPostRequest,
						onPreProcess: function() {
							var self     = this,
								deferred = self.deferred,
								modules  = settings[self.path];

							mockModules.apply(NULL, modules)
								.then(
									function() {
										queue.enqueue.apply(queue, arguments);
										queueHandler.process();
										handlerModule.process.call(self);

										demand
											.apply(NULL, modules)
											.then(
												deferred.resolve,
												function() {
													deferred.reject(new Failure('error resolving', self.path, arguments));
												}
											);
									},
									function() {
										deferred.reject(new Failure('error mocking', NULL, arguments));
									}
								);
						}
					};
				}

				provide(path, [ '/demand/handler/module' ], definition);
			}());

		/**
		 * /demand/plugin/genie
		 */
			(function() {
				var path = MODULE_PREFIX_PLUGIN + 'genie';

				function definition() {
					var pattern = [];

					function onPostConfigure(options) {
						if(isObject(options)) {
							pattern.length = 0;

							iterate(options, function(property, value) {
								pattern.push({ prefix: property, weight: property.length, fn: value });
							});
						}
					}

					demand.on('postConfigure:' + path, onPostConfigure);

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

						configuration.pattern[bundle.id]                           = bundle.fn(matches);
						configuration.modules['/demand/handler/bundle'][bundle.id] = pointer = [];

						for(; (dependency = matches[i]); i++) {
							pointer.push(dependency.id);
						}

						return configuration;
					}

					function getModule(path) {
						return (registry[path] && registry[path].pledge) || (mocks[path] && mocks[path].pledge);
					}

					function resolveDependencies() {
						var i = 0, dependency;

						for(; (dependency = this[i]); i++) {
							dependency.deferred.resolve(arguments[i]);
						}
					}

					function rejectDependencies() {
						var i = 0, dependency;

						for(; (dependency = this[i]); i++) {
							dependency.deferred.reject(new Failure('error resolving', dependency.path));
						}
					}

					demand.on('preResolve', function(dependencies, context) {
						var bundles = {},
							i, dependency, id, parameter, pattern, matches;

						for(i = 0; (dependency = dependencies[i]); i++) {
							if(isTypeOf(dependency, 'string')) {
								id = resolvePath(dependency, context);

								if(!getModule(id) && (parameter = resolveParameter(dependency, context)) && parameter.handler === 'module' && (pattern = matchPattern(id))) {
									(bundles[pattern.prefix] || (bundles[pattern.prefix] = { fn: pattern.fn, matches: [] })).matches.push({ id: id, path: dependency, index: i, deferred: NULL });
								}
							}
						}

						iterate(bundles, function(property, value) {
							matches = value.matches;

							if(matches.length > 1) {
								value.id = '/genie/' + hash(JSON.stringify(value.matches));

								for(i = 0; (dependency = matches[i]); i++) {
									dependency.deferred            = Pledge.defer();
									dependencies[dependency.index] = dependency.deferred.pledge;

									mockModules(dependency.id);
								}

								demand.configure(generateConfiguration(value));
								demand('bundle!' + value.id)
									.then(
										resolveDependencies.bind(matches),
										rejectDependencies.bind(matches)
									);
							}
						});
					});

					return true;
				}

				provide(path, definition);
			}());
	
	/**
	 * --------------------------------
	 * Initialization
	 * --------------------------------
	 */
		(function() {
			function assignModule(id, factory) {
				provide(id, function() { return factory; });
			}

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
			assignModule(MODULE_PREFIX_FUNCTION + 'hash', hash);
			assignModule(MODULE_PREFIX_FUNCTION + 'defer', defer);
			assignModule(MODULE_PREFIX + 'uuid', Uuid);
			assignModule(MODULE_PREFIX + 'pledge', Pledge);
			assignModule(MODULE_PREFIX + 'queue', Queue);
			assignModule(MODULE_PREFIX + 'xhr', Xhr);
			assignModule(MODULE_PREFIX + 'failure', Failure);

			queue        = new Queue();
			queueHandler = new QueueHandler(queue);

			global.demand  = demand;
			global.provide = provide;

			if(configuration && configuration.main) {
				demand(configuration.main);
			}
		}());
}(this, document, 'demand' in this && demand, JSON, Array.prototype, Object.prototype, setTimeout));