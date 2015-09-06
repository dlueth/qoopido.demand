/**
 * Qoopido demand
 *
 * Promise like module loader (XHR) with localStorage caching
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 *
 * @requires XMLHttpRequest, XDomainRequest, JSON.parse, JSON.stringify, Array.forEach
 */

;(function(global) {
	'use strict';

	var // shortcuts
			document              = global.document,
			setTimeout            = global.setTimeout,
			arrayPrototypeSlice   = Array.prototype.slice,
			arrayPrototypeConcat  = Array.prototype.concat,
			target                = document.getElementsByTagName('head')[0],
			resolver              = document.createElement('a'),
			localStorage          = global.localStorage,
		// constants
			DEMAND_PREFIX         = '[demand]',
			DEMAND_SUFFIX_STATE   = '[state]',
			DEMAND_SUFFIX_VALUE   = '[value]',
			STRING_UNDEFINED      = 'undefined',
			STRING_STRING         = 'string',
			STRING_BOOLEAN        = 'boolean',
			PLEDGE_PENDING        = 'pending',
			PLEDGE_RESOLVED       = 'resolved',
			PLEDGE_REJECTED       = 'rejected',
			XHR                   = global.XMLHttpRequest,
			XDR                   = 'XDomainRequest' in global && global.XDomainRequest || XHR,
		// regular expressions
			regexBase             = /^/,
			regexIsAbsolute       = /^\//i,
			regexMatchHandler     = /^([-\w]+\/[-\w]+)!/,
			regexMatchSpecial     = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
			regexMatchCssUrl      = /url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g,
			regexMatchProtocol    = /^http(s?):/,
			regexMatchUrl, regexMatchLsState,
		// flags
			hasRemainingSpace     = localStorage && 'remainingSpace' in localStorage,
		// general storage & objects
			defaults              = { cache: true, debug: false, version: '1.0.0', lifetime: 0, timeout: 5, base: '/' },
			main                  = global.demand.main,
			settings              = global.demand.settings,
			modules               = {},
			pattern               = {},
			probes                = {},
			handler               = {},
			queue, resolve, storage,
		// handler
			JavascriptHandler, CssHandler,
		// configuration
			base, cache, debug, timeoutXhr, timeoutQueue, version, lifetime;

	// main public methods
		/**
		 * request modules
		 *
		 * Will take any number of string arguments and return a Pledge.all
		 * that resolves when all dependencies are resolved and rejects when
		 * at least one dependency is rejected. Both, the resolved and
		 * rejected callbacks will get all dependencies resolved or rejected
		 * as arguments.
		 *
		 * If the scope of the call is of type "Module" relative paths are
		 * resolved in relation to the parent module.
		 */
			function demand() {
				var // make sure we have a context
					self         = this || {},

					// check whether the context is a "Module" or not
					module       = isInstanceOf(self, Module) ? self : null,

					// convert array like "arguments" to array
					dependencies = arrayPrototypeSlice.call(arguments);

				// loop over dependencies
				dependencies.forEach(
					function(dependency, index) {
						var // resolve path
							resolved = resolve.path(dependency, module),

							// shortcut to handler type
							handler  = resolved.handler,

							// shortcut to path
							path     = resolved.path,

							// shortcut to the registry of this particular handler
							pointer  = modules[handler] || (modules[handler] = {});

						// overwrite array item with either an existing Pledge or generate a new one from a Loader
						this[index] = pointer[path] || (pointer[path] = (new Loader(dependency, module)).pledge);
					},
					dependencies);

				// return a Pledge.all to attach resolved and rejected callbacks to
				return Pledge.all(dependencies);
			}

		// provide
			/**
			 * provide modules
			 *
			 * Will either take two arguments, a "path" as a string first
			 * and a "definition" function second or only a "definition"
			 * function in case of an anonymous provide from a loaded module.
			 *
			 * In case of an anonymous provide it will be matched against
			 * the queue to find the loader being resolved by this provide.
			 * In case there is no loader in queue an error is thrown.
			 *
			 * When provide detects a duplicate a warning will be logged to
			 * console in case the "debug" configuration option is set to true.
			 */
			function provide() {
				var// detect if argument[0] is a path, or a definition
					path         = (isTypeOf(arguments[0], STRING_STRING) && arguments[0]) || null,

					// assign factory accordingly
					factory      = !path ? arguments[0] : arguments[1],

					// variable initialization
					loader, dependencies;

				// in case of an anynomous provide check for a loader in queue
				if(!path && queue.current) {
					loader = queue.current;
					path   = loader.handler + '!' + loader.path;
				}

				if(path) {
					// delay further execution to be able to set dependencies via "when" function returned
					setTimeout(function() {
						var // resolve path
							resolved = resolve.path(path),

							// shortcut to the registry of this particular handler
							pointer  = modules[resolved.handler],

							// variable initialization
							module, pledge, defered;

						if(!loader && pointer[resolved.path]) {
							// duplicate non anonymous define
							log('duplicate found for module ' + resolved.path);
						} else {
							// create a new Module
							module = new Module(path, factory, dependencies || []);

							// shortcut to the new module's pledge
							pledge = modules[module.handler][module.path] = module.pledge;

							if(loader) {
								// store in cache if it was loaded from server
								!loader.cached && loader.store();

								// shortcut to the loaders Pledge.defer
								defered = loader.defered;

								// resolve/reject the loader when module is resolved/rejected
								pledge.then(
									function() {
										defered.resolve.apply(null, arguments);
									},
									function() {
										defered.reject(new Error('unable to resolve module', path, arguments));
									}
								);

								// continue to next queued loader if there is one
								queue.length > 0 && queue.next();
							}
						}
					});
				} else {
					// no loader was found
					throw new Error('unspecified anonymous provide');
				}

				// return a when function to be able to set the provide's dependencies
				return { when: function() { dependencies = arrayPrototypeSlice.call(arguments); } };
			}

	// additional static methods
		// configure
			/**
			 * alter configuration
			 *
			 * @param {object} aConfig
			 */
			function configure(aConfig) {
				var // shortcuts to possible configuration options
					aCache    = aConfig.cache,
					aDebug    = aConfig.debug,
					aVersion  = aConfig.version,
					aTimeout  = aConfig.timeout,
					aLifetime = aConfig.lifetime,
					aBase     = aConfig.base,
					aPattern  = aConfig.pattern,
					aProbes   = aConfig.probes,

					// variable initialization
					key;
				
				// set cache config or leave unchanged
				cache   = isTypeOf(aCache, STRING_BOOLEAN)  ? aCache   : cache;
				
				// set debug config or leave unchanged
				debug   = isTypeOf(aDebug, STRING_BOOLEAN)  ? aDebug   : debug;
				
				// set version config or leave unchanged
				version = isTypeOf(aVersion, STRING_STRING) ? aVersion : version;

				// process timeout or leave unchanged
				if(isPositiveInteger(aTimeout)) {
					// limit XHR timeout to 2-10 s and convert to ms
					timeoutXhr   = Math.min(Math.max(aTimeout, 2), 10) * 1000;
					
					// limit queue timeout to 1000-5000 ms from a base of XHR timeout / 5
					timeoutQueue = Math.min(Math.max(timeoutXhr / 5, 1000), 5000);
				}
				
				// process cache lifetime
				if(isPositiveInteger(aLifetime)) {
					// convert s to ms
					lifetime = aLifetime * 1000;
				}
				
				// process base
				if(isTypeOf(aBase, STRING_STRING)) {
					base = pattern.base = new Pattern(regexBase, resolve.url(aBase));
				}
				
				// process pattern
				if(isObject(aPattern)) {
					for(key in aPattern) {
						// 'base' is a reserved key
						key !== 'base' && (pattern[key] = new Pattern(key, aPattern[key]));
					}
				}
				
				// process probes
				if(isObject(aProbes)) {
					for(key in aProbes) {
						probes[key] = aProbes[key];
					}
				}

				// requires truthy return value
				return true;
			}

		// addHandler
			/**
			 * add handler for mimetype
			 *
			 * @param {string} aType
			 * @param {string} aSuffix
			 * @param {object} aHandler
			 */
			function addHandler(aType, aSuffix, aHandler) {
				// prohibit overriding of existing handlers
				if(!handler[aType]) {
					// store handler
					handler[aType] = { suffix: aSuffix, resolve: aHandler.resolve, modify: aHandler.modify };

					// initialize registry for handler
					modules[aType] = {};
				}
			}

	// helper
		// assign
			/**
			 * Shortcut to globally provide internal functions
			 *
			 * @param {string} id
			 * @param {mixed} object
			 */
			function assign(id, object) {
				provide(id, function() { return object; });
			}

		// log
			/**
			 * log a message to the console
			 *
			 * @param {string} aMessage
			 */
			function log(aMessage) {
				// determine message type
				var type = (isInstanceOf(aMessage, Error)) ? 'error' : 'warn';

				// check if console is available
				if(!isTypeOf(console, STRING_UNDEFINED) && (debug || type !== 'warn')) {
					// errors will always be output to console, warnings only when "debug" is enabled
					console[type](aMessage.toString());
				}
			}

		// regex
			/**
			 * shortcut for generating new RegExp
			 *
			 * @param {string} expression
			 * @param {string} modifier
			 *
			 * @returns {RegExp}
			 */
			function regex(expression, modifier) {
				return new RegExp(expression, modifier);
			}

		// escape
			/**
			 * escape a string to be used in a RegExp
			 *
			 * @param {string} aValue
			 *
			 * @returns {string}
			 */
			function escape(aValue) {
				return aValue.replace(regexMatchSpecial, '\\$&');
			}

		// removeProtocol
			/**
			 * remove protocol from any given URL
			 *
			 * @param {string} url
			 *
			 * @returns {string}
			 */
			function removeProtocol(url) {
				return url.replace(regexMatchProtocol, '');
			}

		// isAbsolute
			/**
			 * check whether a given path is absolute
			 *
			 * @param {string} aPath
			 *
			 * @returns {boolean}
			 */
			function isAbsolute(aPath) {
				return regexIsAbsolute.test(aPath);
			}

		// isInstanceOf
			/**
			 * check whether a passed object is an instance of a certain type
			 *
			 * @param {mixed} object
			 *
			 * @param {function} module
			 *
			 * @returns {boolean}
			 */
			function isInstanceOf(object, module) {
				return object instanceof module;
			}
			
		// isTypeOf
			/**
			 * check wheter a given object is of a certain type
			 *
			 * @param {mixed} object
			 *
			 * @param {string} type
			 *
			 * @returns {boolean}
			 */
			function isTypeOf(object, type) {
				return typeof object === type;
			}

		// isObject
			/**
			 * check whether a given object is an object
			 *
			 * @param {mixed} object
			 *
			 * @returns {boolean}
			 */
			function isObject(object) {
				return object && isTypeOf(object, 'object');
			}

		// isPositiveInteger
			/**
			 * check whether a given value is a positive integer
			 *
			 * @param {mixed} value
			 *
			 * @returns {boolean}
			 */
			function isPositiveInteger(value) {
				return isTypeOf(value, 'number') && isFinite(value) && Math.floor(value) === value && value >= 0;
			}

		// resolve
			resolve = {
				/**
				 * resolve any given url
				 *
				 * @param {string} aUrl
				 *
				 * @returns {string}
				 */
				url: function(aUrl) {
					resolver.href = aUrl;

					return resolver.href;
				},
				/**
				 * resolve any given path
				 *
				 * if context is either "Loader" or "Module" nothing will
				 * be returned but instead "handler" and "path" will be
				 * set directly on context. In case of "Loader" an
				 * additional property "url" will be set as well.
				 *
				 * @param {string} aPath
				 * @param {object} aParent
				 *
				 * @returns {void|{handler: string, path: string}}
				 */
				path: function(aPath, aParent) {
					var // shortcut
						self     = this,
						
						// pointer to specific handler set, or default handler
						pointer  = aPath.match(regexMatchHandler) || 'application/javascript',
						
						// flag if this is an instance of "Loader"
						isLoader = isInstanceOf(self, Loader),
						
						// variable initialization
						key, match;
						
					// process a specific handler
					if(!isTypeOf(pointer, STRING_STRING)) {
						// remove handler prefix from path
						aPath   = aPath.replace(regex('^' + escape(pointer[0])), '');
						
						// set pointer to the actual handler name
						pointer = pointer[1];
					}

					if(!isAbsolute(aPath)) {
						// make any relative path absolute considering a possible parent module
						aPath = '/' + resolve.url(((aParent && aParent.path && resolve.url(aParent.path + '/../')) || '/') + aPath).replace(regexMatchUrl, '');
					}
					
					// match the resulting path to all pattern
					for(key in pattern) {
						pattern[key].matches(aPath) && (match = pattern[key]);
					}
					
					// set handler and path on context, if this is a "Module" or "Loader"
					if(isLoader || isInstanceOf(self, Module)) {
						self.handler = pointer;
						self.path    = aPath;
						
						// if this is a "Loader" set "url" additionally
						isLoader && (self.url = removeProtocol(resolve.url(match.process(aPath))));
					} else {
						// return object containing handler and path
						return { handler: pointer, path: aPath };
					}
				}
			};

		// storage
			storage = {
				/**
				 * retrieve cache for a given path and URL
				 *
				 * @param {string} aPath
				 * @param {string} aUrl
				 *
				 * @returns {void|string}
				 */
				get: function(aPath, aUrl) {
					var // variable initialization
						id, state;

					// continue only if localStorage is supported and cache is enabled
					if(localStorage && cache) {
						// build paths localStorage prefix id
						id    = DEMAND_PREFIX + '[' + aPath + ']';

						// fetch state
						state = JSON.parse(localStorage.getItem(id + DEMAND_SUFFIX_STATE));

						if(state && state.version === version && state.url === aUrl && (state.expires === 0 || state.expires > new Date().getTime())) {
							// return stored value if state is set, states version matches global version, states url matches given url and cache is not expired
							return localStorage.getItem(id + DEMAND_SUFFIX_VALUE);
						} else {
							// clear cache otherwise
							storage.clear(aPath);
						}
					}
				},
				/**
				 * store cache for a given path, value and url
				 *
				 * @param {string} aPath
				 * @param {string} aValue
				 * @param {string} aUrl
				 */
				set: function(aPath, aValue, aUrl) {
					var // variable initialization
						id, spaceBefore;

					// continue only if localStorage is supported and cache is enabled
					if(localStorage && cache) {
						// build paths localStorage prefix id
						id = DEMAND_PREFIX + '[' + aPath + ']';

						try {
							// determine remainingSpace if supported, set to "null" otherwise
							spaceBefore = hasRemainingSpace ? localStorage.remainingSpace : null;

							// set path state and value items
							localStorage.setItem(id + DEMAND_SUFFIX_VALUE, aValue);
							localStorage.setItem(id + DEMAND_SUFFIX_STATE, JSON.stringify({ version: version, expires: lifetime > 0 ? new Date().getTime() + lifetime : 0, url: aUrl }));

							if(spaceBefore !== null && localStorage.remainingSpace === spaceBefore) {
								// throw error if remainingSpace is supported and is equal to what is was before
								throw 'QuotaExceedError';
							}
						} catch(error) {
							// log warning otherwise
							log('unable to cache module ' + aPath);
						}
					}
				},
				/**
				 * clear either a given path, all cached resources or only expired resources
				 *
				 * @param {string|boolean|void} aPath
				 */
				clear: function(aPath) {
					var // variable initialization
						id, key, match, state;

					// continue only if localStorage is supported and cache is enabled
					if(localStorage && cache) {
						// handle possible types of aPath
						switch(typeof aPath) {
							// handle if aPath is of type "string"
							// => clear specific
							case STRING_STRING:
								// build paths localStorage prefix id
								id = DEMAND_PREFIX + '[' + aPath + ']';

								// remove localStorage state and value items
								localStorage.removeItem(id + DEMAND_SUFFIX_STATE);
								localStorage.removeItem(id + DEMAND_SUFFIX_VALUE);

								break;
							// handle if aPath is of type "boolean"
							// => clear expired
							case STRING_BOOLEAN:
								// continue only if aPath is truthy
								if(aPath) {
									// loop over all localStorage keys
									for(key in localStorage) {
										// match current key against regex to make sure it is demand-related
										match = key.match(regexMatchLsState);

										if(match) {
											// get state if key was matched
											state = JSON.parse(localStorage.getItem(DEMAND_PREFIX + '[' + match[1] + ']' + DEMAND_SUFFIX_STATE));

											if(state && state.expires > 0 && state.expires <= new Date().getTime()) {
												// clear storage for match if expired
												storage.clear(match[1]);
											}
										}
									}
								}

								break;
							// handle if aPath is of type "undefined"
							// => clear all
							case STRING_UNDEFINED:
								// loop over all localStorage keys
								for(key in localStorage) {
									// clear storage if key is demand-related
									key.indexOf(DEMAND_PREFIX) === 0 && (localStorage.removeItem(key));
								}

								break;
						}
					}
				}
			};

	// modules
		// Pledge
			/**
			 * provides promise like behaviour
			 *
			 * unlike native Promises and polyfills a Pledge
			 * can be resolved and rejected with multiple values
			 * which will all get applied
			 *
			 * @param {function} executor
			 *
			 * @constructor
			 */
			function Pledge(executor) {
				var // shortcut to context
					self     = this,

					// object storing resolve and reject listeners as separate arrays
					listener = { resolved: [], rejected: [] };

				function resolve() {
					handle(PLEDGE_RESOLVED, arguments);
				}

				function reject() {
					handle(PLEDGE_REJECTED, arguments);
				}

				function handle(aState, aParameter) {
					// continue only if Pledge is still "pending"
					if(self.state === PLEDGE_PENDING) {
						// set properties
						self.state = aState;
						self.value = aParameter;

						// handle listener
						listener[aState].forEach(function(aHandler) {
							// apply values to listener
							aHandler.apply(null, self.value);
						});
					}
				}

				self.then = function(aResolved, aRejected) {
					if(self.state === PLEDGE_PENDING) {
						// add listeners to internal storage when Pledge is "pending"
						aResolved && listener[PLEDGE_RESOLVED].push(aResolved);
						aRejected && listener[PLEDGE_REJECTED].push(aRejected);
					} else {
						// directly call listeners when Pledge was already "resolved" or "rejected"
						switch(self.state) {
							case PLEDGE_RESOLVED:
								// apply values to listener
								aResolved.apply(null, self.value);

								break;
							case PLEDGE_REJECTED:
								// apply values to listener
								aRejected.apply(null, self.value);

								break;
						}
					}
				};

				// run executor
				executor(resolve, reject);
			}

			Pledge.prototype = {
				constructor: Pledge,
				state:       PLEDGE_PENDING,
				value:       null,
				listener:    null,
				then:        null
			};

			/**
			 * provides Promise.defer like behaviour
			 *
			 * @returns {object}
			 */
			Pledge.defer = function() {
				var self = {};

				// create Pledge
				self.pledge = new Pledge(function(aResolve, aReject) {
					// link properties "resolve" and "reject" to the Pledge
					self.resolve = aResolve;
					self.reject  = aReject;
				});

				return self;
			};

			/**
			 * provides Promise.all like behaviour
			 *
			 * unlike native Promise.all Pledge.all will not reject on the
			 * first rejected Pledge but when all Pledges ere either
			 * resolved or rejected. Rejection callbacks will get passed
			 * all rejected reasons, not only the first one.
			 *
			 * @param {array} aPledges
			 *
			 * @returns {Pledge}
			 */
			Pledge.all = function(aPledges) {
				var // create internal defered Pledge
					defered       = Pledge.defer(),

					// shortcut to pledge
					pledge        = defered.pledge,

					// storage for values of resolved pledges
					resolved      = [],

					// storage for values of rejected pledges
					rejected      = [],

					// total count of input pledges
					countTotal    = aPledges.length,

					// count of resolved pledges
					countResolved = 0;

				// loop over passed pledges
				aPledges.forEach(function(aPledge, aIndex) {
					// register to pledges resolved and rejected states
					aPledge.then(
						function() {
							// add all resolved values to storage
							resolved[aIndex] = arrayPrototypeSlice.call(arguments);

							// increase counter
							countResolved++;

							// resolve internal defered Pledge when all pledges were resolved
							countResolved === countTotal && defered.resolve.apply(null, arrayPrototypeConcat.apply([], resolved));
						},
						function() {
							// add all rejected values to storage
							rejected.push(arrayPrototypeSlice.call(arguments));

							// check if all pledges got resolved/rejected and reject internal defered
							rejected.length + countResolved === countTotal && defered.reject.apply(null, arrayPrototypeConcat.apply([], rejected));
						}
					);
				});

				return pledge;
			};

			/**
			 * provides Promise.race like behaviour
			 *
			 * @param {array} aPledges
			 *
			 * @returns {Pledge}
			 */
			Pledge.race = function(aPledges) {
				var // create internal defered Pledge
					defered = Pledge.defer();

				// loop over passed pledges
				aPledges.forEach(function(aPledge) {
					// map internal resolve/reject to pledges
					aPledge.then(
						defered.resolve,
						defered.reject
					);
				});

				return defered.pledge;
			};

		// Error
			/**
			 * internal error class
			 *
			 * @param {string} aMessage
			 * @param {string} aModule
			 * @param {array} aStack
			 *
			 * @constructor
			 */
			function Error(aMessage, aModule, aStack) {
				var // shortcut to context
					self = this;

				// set properties
				self.message = aMessage;
				self.module  = aModule;

				aStack && (self.stack = arrayPrototypeSlice.call(aStack));
			}

			Error.prototype = {
				message: null,
				module:  null,
				stack:   null,
				/**
				 * handles output to console
				 *
				 * @returns {string}
				 */
				toString: function() {
					var // shortcut to context
						self   = this,

						// initialize result
						result = DEMAND_PREFIX + ' ' + self.message + ' ' + self.module;

					// process potential stack
					if(self.stack) {
						result = Error.traverse(self.stack, result, 1);
					}

					return result;
				}
			};

			/**
			 * handles recursion of stack on output to console
			 *
			 * @param {array} stack
			 * @param {string} value
			 * @param {integer} depth
			 *
			 * @returns {string}
			 */
			Error.traverse = function(stack, value, depth) {
				var // prepare indention
					indention = new Array(depth + 1).join(' ');

				// loop over each stackitem
				stack.forEach(function(item) {
					value += '\n' + indention + '> ' + item.message + ' ' + item.module;

					// handle possible nested stacks
					if(item.stack) {
						value = Error.traverse(item.stack, value, depth + 1);
					}
				});

				return value;
			};

		// Pattern
			/**
			 * abstraction for pattern matching of paths
			 *
			 * @param {RegExp|string} aPattern
			 * @param {strin} aUrl
			 *
			 * @constructor
			 */
			function Pattern(aPattern, aUrl) {
				var self = this;

				self.url          = resolve.url(aUrl);
				self.regexPattern = (isInstanceOf(aPattern, RegExp)) ? aPattern : regex('^' + escape(aPattern));
				self.regexUrl     = regex('^' + escape(aUrl));
			}

			Pattern.prototype = {
				url:          null,
				regexPattern: null,
				regexUrl:     null,
				matches: function(aPath) {
					return this.regexPattern.test(aPath);
				},
				remove: function(aUrl) {
					return aUrl.replace(this.regexUrl, '');
				},
				process: function(aPath) {
					var self = this;

					return aPath.replace(self.regexPattern, self.url);
				}
			};

		// Queue
			/**
			 * Queue handling for providing anonymous loaded modules
			 *
			 * @constructor
			 */
			function Queue() {
				var self = this;

				self.current = null;
				self.queue   = [];
			}

			Queue.prototype = {
				current: null,
				queue:   null,
				length:  0,
				add: function(aItem) {
					var self  = this,
						queue = self.queue;

					queue.push(aItem);

					self.length++;

					queue.length === 1 && self.next();
				},
				next: function() {
					var self    = this,
						current = self.current,
						queue   = self.queue,
						defered, path, pointer;

					if(current) {
						self.current = null;

						queue.shift();
						self.length--;
					}

					if(queue.length) {
						current = self.current = self.queue[0];
						defered = current.defered;
						path    = current.path;
						pointer = handler[current.handler];

						!current.cached && pointer.modify && (current.source = pointer.modify(current.url, current.source));

						pointer.resolve(path, current.source);

						if(probes[path]) {
							current.probe();
						}

						setTimeout(function() {
							defered.reject(new Error('timeout resolving module', path));
						}, timeoutQueue);
					}
				}
			};

		// Loader
			/**
			 * module loader
			 *
			 * @param {string} aPath
			 * @param {object} aParent
			 *
			 * @constructor
			 */
			function Loader(aPath, aParent) {
				var self    = this,
					defered = Pledge.defer(),
					xhr, pointer;

				resolve.path.call(self, aPath, aParent);

				self.defered = defered;
				self.pledge  = defered.pledge;
				pointer      = handler[self.handler];

				if(!parent) {
					self.pledge.then(null, log);
				}

				if(pointer) {
					self.retrieve();

					if(self.cached) {
						queue.add(self);
					} else {
						xhr            = regexMatchUrl.test(self.url) ? new XHR() : new XDR();
						xhr.onprogress = function() {};
						xhr.ontimeout  = xhr.onerror = xhr.onabort = function() { defered.reject(new Error('unable to load module', self.path)); };
						xhr.onload     = function() { self.source = xhr.responseText; queue.add(self);};

						xhr.open('GET', self.url + pointer.suffix, true);
						xhr.send();

						setTimeout(function() { if(xhr.readyState < 4) { xhr.abort(); } }, timeoutXhr);
					}
				} else {
					defered.reject(new Error('no handler "' + self.handler + '" for', self.path));
				}
			}

			Loader.prototype = {
				handler: null,
				path:    null,
				url:     null,
				defered: null,
				pledge:  null,
				cached:  false,
				source:  null,
				/**
				 * probe for the loading state of an external module
				 */
				probe: function() {
					var self      = this,
						path      = self.path,
						isPending = self.pledge.state === PLEDGE_PENDING,
						result;

					if(isPending) {
						if(result = probes[path]()) {
							provide(function() { return result; });
						} else {
							setTimeout(self.probe, 100);
						}
					}
				},
				/**
				 * store loaders result in localStorage
				 */
				store: function() {
					var self = this;

					storage.set(self.path, self.source, self.url);
				},
				/**
				 * retrieve cache for loader
				 */
				retrieve: function() {
					var self   = this,
						cache  = storage.get(self.path, self.url),
						cached = self.cached = !!(cache);

					cached && (self.source = cache);
				}
			};

		// Module
			/**
			 * module constructor
			 *
			 * @param {string} aPath
			 * @param {function} aDefinition
			 * @param aDependencies
			 *
			 * @constructor
			 */
			function Module(aPath, aDefinition, aDependencies) {
				var self    = this,
					defered = Pledge.defer();

				resolve.path.call(self, aPath);

				(self.pledge = defered.pledge).then(null, function() {
					log(new Error('unable to resolve module', self.path, arguments));
				});

				if(aDependencies.length > 0) {
					demand.apply(self, aDependencies)
						.then(
							function() { defered.resolve(aDefinition.apply(null, arguments)); },
							function() { defered.reject(new Error('unable to resolve dependencies for', self.path, arguments)); }
						);
				} else {
					defered.resolve(aDefinition());
				}
			}

			Module.prototype = {
				handler: null,
				path:    null,
				pledge:  null
			};

	// handler
		// JavaScript
			JavascriptHandler = {
				resolve: function(aPath, aValue) {
					var script = document.createElement('script');

					script.type  = 'application/javascript';
					script.defer = script.async = true;
					script.text  = aValue;

					script.setAttribute('demand-path', aPath);

					target.appendChild(script);
				}
			};

		// CSS
			CssHandler = {
				resolve: function(aPath, aValue) {
					var style = document.createElement('style'),
						sheet = style.styleSheet;

					style.type  = 'text/css';
					style.media = 'only x';
					(sheet && (sheet.cssText = aValue)) || (style.innerHTML = aValue);

					style.setAttribute('demand-path', aPath);

					target.appendChild(style);

					setTimeout(function() {
						provide(function() { return style; });
					});
				},
				modify: function(aUrl, aValue) {
					var base = resolve.url(aUrl + '/..'),
						match;

					while((match = regexMatchCssUrl.exec(aValue))) {
						aValue = aValue.replace(match[0], 'url(' + resolve.url(base + match[1]) + ')');
					}

					return aValue;
				}
			};

	// initialization
		// url
			regexMatchUrl     = regex('^' + escape(resolve.url('/')));
			regexMatchLsState = regex('^' + escape(DEMAND_PREFIX + '\[(.+?)\]' + DEMAND_SUFFIX_STATE + '$'));

		// create queue
			queue = new Queue();

		// execute localStorage garbage collection
			storage.clear(true);

		// add default handler
			addHandler('application/javascript', '.js', JavascriptHandler);
			addHandler('text/css', '.css', CssHandler);

		// configure
			configure(defaults) && settings && configure(settings);

		// register in global scope
			demand.configure  = configure;
			demand.addHandler = addHandler;
			demand.clear      = storage.clear;
			global.demand     = demand;
			global.provide    = provide;

		// register modules
			assign('/demand', demand);
			assign('/provide', provide);
			assign('/pledge', Pledge);
			assign('/validator/isTypeOf', isTypeOf);
			assign('/validator/isInstanceOf', isInstanceOf);
			assign('/validator/isObject', isObject);
			assign('/validator/isPositiveInteger', isPositiveInteger);

	// load main script
		if(main) {
			demand(main);
		}
}(this));