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

(function(global, document, JSON, XMLHttpRequest, setTimeout, clearTimeout, snippet, arrayPrototype, objectPrototype, XHR) {
	'use strict';
	
	var /** pointer */
			arrayPrototypeSlice     = arrayPrototype.slice,
			arrayPrototypeConcat    = arrayPrototype.concat,
			objectPrototypeToString = objectPrototype.toString,
		/** constants */
			DEMAND_ID               = 'demand',
			PROVIDE_ID              = 'provide',
			SETTINGS_ID             = 'settings',
			MODULE_PREFIX           = '/' + DEMAND_ID + '/',
			MODULE_PREFIX_STORAGE   = MODULE_PREFIX + 'storage/',
			MODULE_PREFIX_HANDLER   = MODULE_PREFIX + 'handler/',
			MODULE_PREFIX_LOCAL     = MODULE_PREFIX + 'local',
			MODULE_PREFIX_SETTINGS  = MODULE_PREFIX + 'settings',
			MODULE_PREFIX_VALIDATOR = MODULE_PREFIX + 'validator/',
			PLEDGE_PENDING          = 'pending',
			PLEDGE_RESOLVED         = 'resolved',
			PLEDGE_REJECTED         = 'rejected',
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
			regexMatchEvent         = /^cache(Miss|Hit|Clear|Exceed)|(pre|post)(Request|Process|Cache)$/,
		/** other */
			settings                = { cache: {}, timeout: 8 * 1000, pattern: {}, modules: {}, handler: 'module' },
			resolver                = document.createElement('a'),
			registry                = {},
			mocks                   = {},
			listener                = {},
			regexMatchBaseUrl, queue, storage;

	/**
	 * --------------------------------
	 * Utility functions (private)
	 * --------------------------------
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

		function assign(id, factory) {
			provide(id, function() { return factory; });
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
				
				if(context && (dependency === DEMAND_ID || dependency === PROVIDE_ID || dependency === SETTINGS_ID)) {
					switch(dependency) {
						case DEMAND_ID:
							path       = MODULE_PREFIX_LOCAL + path;
							definition = function() {
								var scopedDemand = demand.bind(context),
									key;

								for(key in demand) {
									scopedDemand[key] = demand[key];
								}

								return scopedDemand;
							};

							break;
						case PROVIDE_ID:
							path       = MODULE_PREFIX_LOCAL + path;
							definition = function() {
								return provide.bind(context);
							};

							break;
						case SETTINGS_ID:
							path       = MODULE_PREFIX_SETTINGS + context;
							definition = function() {
								return settings.modules[context] || (settings.modules[context] = {});
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
				key, match;

			path = resolvePath(path, context);

			if(!regexIsAbsoluteUri.test(path)) {
				for(key in pattern) {
					pattern[key].matches(path) && (!match || match.weight < pattern[key].weight) && (match = pattern[key]);
				}
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

		function resolveLoader(loader) {
			var handler = loader.handler;

			emit('preProcess', loader);

			if(loader.deferred.pledge.state === PLEDGE_PENDING) {
				handler.onPreProcess && handler.onPreProcess.call(loader);
				handler.process && queue.add(loader);
			}
		}

	/**
	 * --------------------------------
	 * Utility functions (public)
	 * --------------------------------
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
		 * resolveUrl
		 *
		 * Convert a given URL to its resolved absolute representation
		 *
		 * @param {string} url
		 *
		 * @return {string}
		 */
		function resolveUrl(url) {
			resolver.href = url;

			return resolver.href;
		}

		/**
		 * mock
		 *
		 * Mock an array of module paths
		 *
		 * @param {array} modules
		 *
		 * @return {Pledge}
		 */
		function mock(modules) {
			var pledges = [],
				i = 0, module, pledge, parameter;
			
			for(; (module = modules[i]); i++) {
				parameter  = module.match(regexMatchParameter);
				module     = module.replace(regexMatchParameter, '');
				modules[i] = (parameter ? 'mock:' + parameter.slice(1).join('')  : 'mock:') + '!' + module;
				pledge     = (mocks[module] || (mocks[module] = Pledge.defer())).pledge;
				
				pledges.push(pledge);
			}
			
			demand.apply(NULL, modules);
			
			return Pledge.all(pledges);
		}

	/**
	 * --------------------------------
	 * Utility modules (private)
	 * --------------------------------
	 */
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

		function Loader(path, parameter) {
			var self     = this,
				deferred = Pledge.defer(),
				pledge   = deferred.pledge,
				handler  = parameter.handler,
				xhr, timeout;

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

								if(pledge.state === PLEDGE_PENDING) {
									xhr = regexMatchBaseUrl.test(self.url) ? new XHR() : new XDR();

									xhr.onprogress = function() {};
									xhr.ontimeout = xhr.onerror = xhr.onabort = function() {
										deferred.reject(new Reason('timeout requesting', self.path));
									};
									xhr.onload = function() {
										var type = xhr.getResponseHeader && xhr.getResponseHeader('content-type');

										timeout = clearTimeout(timeout);

										if((!('status' in xhr) || xhr.status === 200) && (!type || !handler.matchType || handler.matchType.test(type))) {
											self.source = xhr.responseText;

											emit('postRequest', self);

											if(pledge.state === PLEDGE_PENDING) {
												handler.onPostRequest && handler.onPostRequest.call(self);
												resolveLoader(self);

												if(self.cache !== false) {
													pledge.then(function() { storage.set(self); });
												}
											}
										} else {
											deferred.reject(new Reason('error requesting', self.path));
										}
									};

									xhr.open('GET', self.url, true);
									xhr.send();

									timeout = setTimeout(function() {
										if(xhr.readyState < 4) {
											xhr.abort();
										}
									}, settings.timeout);
								}
							} else {
								setTimeout(function() {
									resolveLoader(self);
								});
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

	/**
	 * --------------------------------
	 * Utility modules (public)
	 * --------------------------------
	 */
		/**
		 * Pledge
		 *
		 * @param {function} executor
		 *
		 * @constructor
		 */
		function Pledge(executor) {
			var self     = this,
				listener = { resolved: [], rejected: [] };

			function resolve() {
				handle(PLEDGE_RESOLVED, arguments);
			}

			function reject() {
				handle(PLEDGE_REJECTED, arguments);
			}

			function handle(aState, aParameter) {
				var pointer, result;

				if(self.state === PLEDGE_PENDING) {
					self.state = aState;
					self.value = aParameter;

					while(pointer = listener[aState].shift()) {
						result = pointer.handler.apply(NULL, aParameter);

						if(result && typeof result.then === 'function') {
							result.then(pointer.deferred.resolve, pointer.deferred.reject);
						} else {
							pointer.deferred.resolve(result);
						}
					}

					listener = NULL;
				}
			}

			self.then = function(aResolved, aRejected) {
				var deferred = Pledge.defer();

				if(self.state === PLEDGE_PENDING) {
					aResolved && listener[PLEDGE_RESOLVED].push({ handler: aResolved, deferred: deferred });
					aRejected && listener[PLEDGE_REJECTED].push({ handler: aRejected, deferred: deferred });
				} else {
					switch(self.state) {
						case PLEDGE_RESOLVED:
							deferred.resolve(aResolved && aResolved.apply(NULL, self.value));

							break;
						case PLEDGE_REJECTED:
							deferred.reject(aRejected && aRejected.apply(NULL, self.value));

							break;
					}
				}

				return deferred.pledge;
			};

			executor(resolve, reject);
		}

		Pledge.prototype = {
			state:  PLEDGE_PENDING
			/* only for reference
			value:  NULL,
			then:   NULL,
			cache:  NULL, // will only be set by storage
			*/
		};

		Pledge.defer = function() {
			var self = {};

			self.pledge = new Pledge(function(aResolve, aReject) {
				self.resolve = aResolve;
				self.reject  = aReject;
			});

			return self;
		};

		Pledge.all = function(pledges) {
			var deferred      = Pledge.defer(),
				resolved      = [],
				rejected      = [],
				countTotal    = pledges.length,
				countResolved = 0,
				i = 0, pledge;

			function observePledge(index, pledge) {
				pledge.then(
					function() {
						resolved[index] = arrayPrototypeSlice.call(arguments);

						countResolved++;

						checkState();
					},
					function() {
						rejected.push(arrayPrototypeSlice.call(arguments));

						checkState();
					}
				);
			}

			function checkState() {
				if(countResolved === countTotal) {
					deferred.resolve.apply(NULL, arrayPrototypeConcat.apply([], resolved));
				} else if(rejected.length + countResolved === countTotal) {
					deferred.reject.apply(NULL, arrayPrototypeConcat.apply([], rejected));
				}
			}

			for(; pledge = pledges[i]; i++) {
				observePledge(i, pledge);
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

		/**
		 * Reason
		 *
		 * @param message
		 * @param module
		 * @param stack
		 *
		 * @constructor
		 */
		function Reason(message, module, stack) {
			this.message = message;

			module && (this.module = module);
			stack && (this.stack = arrayPrototypeSlice.call(stack));
		}

		Reason.prototype = {
			/* only for reference
			message: NULL,
			module:  NULL,
			stack:   NULL,
			*/
			toString: function() {
				var self   = this,
					result = DEMAND_ID + ': ' + self.message + ' ' + (self.module ? '"' + self.module + '"' : '');

				if(self.stack) {
					result = Reason.traverse(self.stack, result, 1);
				}

				return result;
			}
		};

		Reason.traverse = function(stack, value, depth) {
			var indention = new Array(depth + 1).join(' '),
				i = 0, item;

			for(; item = stack[i]; i++) {
				value += '\n' + indention + '> ' + item.message + ' ' + (item.module ? '"' + item.module + '"' : '');

				if(item.stack) {
					value = Reason.traverse(item.stack, value, depth + 1);
				}
			}

			return value;
		};

		/**
		 * Queue
		 *
		 * @constructor
		 */
		function Queue() {
			this.items = 0;
			this.stack = [];
		}

		Queue.prototype = {
			/* only for reference
			items:   NULL,
			queue:   NULL,
			current: NULL,
			*/
			add: function() {
				queue.stack  = queue.stack.concat(arrayPrototypeSlice.call(arguments));
				queue.items += arguments.length;

				!queue.current && queue.process();
			},
			process: function() {
				var current;

				if(queue.items) {
					queue.items--;

					current = queue.current = queue.stack.shift();

					current.handler.process.call(current);
					emit('postProcess', current);
				}
			}
		};


	/**
	 * --------------------------------
	 * Demand
	 * --------------------------------
	 */
		function demand() {
			var dependencies = arrayPrototypeSlice.call(arguments),
				i = 0, dependency;

			for(; (dependency = dependencies[i]); i++) {
				dependencies[i] = resolveDependency(dependency, this !== window ? this : NULL);
			}

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
				key, temp, subkey;

			if(isTypeOf(cache, STRING_BOOLEAN)) {
				settings.cache[''] = { weight: 0, state: cache };
			} else if(isObject(cache)) {
				for(key in cache) {
					settings.cache[key] = { weight: key.length, state: cache[key] };
				}
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
				for(key in pattern) {
					key !== 'base' && (settings.pattern[key] = new Pattern(key, pattern[key]));
				}
			}
			
			if(isObject(modules)) {
				for(key in modules) {
					if(key !== MODULE_PREFIX_STORAGE) {
						temp = modules[key];
						
						for(subkey in temp) {
							(pointer[key] || (pointer[key] = {}))[subkey] = temp[subkey];
						}
					}
				}
			}
		};

		demand.remove = function(path) {
			if(registry[path]) {
				!!registry[path].cache && storage.clean.path(path);

				delete registry[path];
				delete mocks[path];
			}
		};

		demand.on = function(events, callback) {
			var event;

			if(isTypeOf(events, STRING_STRING) && isTypeOf(callback, STRING_FUNCTION)) {
				events = events.split(' ');

				while(event = events.shift()) {
					if(regexMatchEvent.test(event)) {
						(listener[event] || (listener[event] = [])).push(callback);
					}
				}
			}

			return demand;
		};

		demand.list = function(state) {
			var keys, path, pledge;

			if(state) {
				keys = [];

				for(path in registry) {
					pledge = registry[path].pledge;

					if(pledge.state === state || pledge.cache === state) {
						keys.push(path);
					}
				}
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

				queue.current = NULL;

				queue.items > 0 && queue.process();
			}

			if(path) {
				path       = resolvePath(path, this);
				deferred   = registry[path] || (registry[path] = Pledge.defer());
				pledge     = deferred.pledge;
				isFunction = isTypeOf(definition, STRING_FUNCTION);

				if(pledge.state === PLEDGE_PENDING) {
					if(dependencies) {
						demand
							.apply(path, dependencies)
							.then(
								function() { deferred.resolve(isFunction ? definition.apply(NULL, arguments) : definition); },
								function() { log(new Reason('error providing', path, arguments)); }
							);
					} else {
						deferred.resolve(isFunction ? definition() : definition);
					}
				}
			} else {
				throw 'unspecified anonymous provide';
			}
		}

	/**
	 * --------------------------------
	 * Inline modules
	 * --------------------------------
	 */
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
					var key, pointer, match;

					if(loader.cache !== NULL) {
						return loader.cache;
					}

					for(key in settings.cache) {
						pointer = settings.cache[key];

						if(loader.path.indexOf(key) === 0 && (!match || pointer.weight > match.weight)) {
							match = pointer;
						}
					}

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
									throw 'QUOTA_EXCEEDED_ERR';
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
							var key, match;

							if(localStorage) {
								for(key in localStorage) {
									match = key.match(regexMatchState);

									if(match) {
										this.path(match[1]);
									}
								}
							}
						},
						expired: function() {
							var key, match, state;

							if(localStorage) {
								for(key in localStorage) {
									match = key.match(regexMatchState);

									if(match) {
										state = JSON.parse(localStorage.getItem(STORAGE_PREFIX + '[' + match[1] + ']' + STORAGE_SUFFIX_STATE));

										if(state && state.expires > 0 && state.expires <= getTimestamp()) {
											this.path(match[1]);
										}
									}
								}
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
	 * --------------------------------
	 * Initialization
	 * --------------------------------
	 */
		regexMatchBaseUrl = createRegularExpression('^' + escapeRegularExpression(resolveUrl('/')));

		demand.configure({ cache: true, base: '/', pattern: { '/demand': resolveUrl(((snippet && snippet.url) || location.href) + '/../').slice(0, -1)} });
		snippet && snippet.settings && demand.configure(snippet.settings);

		assign(MODULE_PREFIX_VALIDATOR + 'isArray', isArray);
		assign(MODULE_PREFIX_VALIDATOR + 'isObject', isObject);
		assign(MODULE_PREFIX_VALIDATOR + 'isTypeOf', isTypeOf);
		assign(MODULE_PREFIX_VALIDATOR + 'isInstanceOf', isInstanceOf);
		assign(MODULE_PREFIX_VALIDATOR + 'isPositiveInteger', isPositiveInteger);
		assign(MODULE_PREFIX + 'function/resolveUrl', resolveUrl);
		assign(MODULE_PREFIX + 'mock', mock);
		assign(MODULE_PREFIX + 'queue', (queue = new Queue()).add);
		assign(MODULE_PREFIX + 'pledge', Pledge);
		assign(MODULE_PREFIX + 'reason', Reason);

		global.demand  = demand;
		global.provide = provide;

		if(snippet && snippet.main) {
			demand(snippet.main);
		}
}(this, document, JSON, XMLHttpRequest, setTimeout, clearTimeout, 'demand' in this && demand, Array.prototype, Object.prototype, XMLHttpRequest));