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
 */

;(function(global, document, setTimeout, clearTimeout, localStorage, XMLHttpRequest, configMain, configSettings) {
	'use strict';

	var // shortcuts
			arrayPrototypeSlice   = Array.prototype.slice,
			arrayPrototypeConcat  = Array.prototype.concat,
			target                = document.getElementsByTagName('head')[0],
			resolver              = document.createElement('a'),
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
			NULL                  = null,
			XHR                   = XMLHttpRequest,
			XDR                   = 'XDomainRequest' in global &&  global.XDomainRequest || XHR,
		// regular expressions
			regexIsAbsolute       = /^\//i,
			regexMatchHandler     = /^([-\w]+\/[-\w]+)!/,
			regexMatchSpecial     = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
			regexMatchSourcemap   = /\/\/#\s+sourceMappingURL\s*=\s*(.+?)\.map/g,
			regexMatchCssUrl      = /url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g,
			regexMatchProtocol    = /^http(s?):/,
			regexMatchUrl, regexMatchLsState,
		// flags
			hasRemainingSpace     = localStorage && 'remainingSpace' in localStorage,
		// general storage & objects
			defaults              = { cache: true, debug: false, version: '1.0.0', lifetime: 0, timeout: 5, base: '/' },
			modules               = {},
			pattern               = {},
			probes                = {},
			handler               = {},
			queue, resolve, storage,
		// handler
			JavascriptHandler, CssHandler,
		// configuration
			base, cache, debug, timeoutXhr, timeoutQueue, version, lifetime;

	/**
	 * demand required modules
	 *
	 * Will take any number of string arguments and return a Pledge.all
	 * that resolves when all dependencies are resolved and rejects when
	 * at least one dependency is rejected. Both, the resolved and
	 * rejected callbacks will get all dependencies resolved or rejected
	 * as arguments.
	 *
	 * If the scope of the call is of type "Module" relative paths are
	 * resolved in relation to the parent module.
	 *
	 * @param {...String} dependency
	 *
	 * @exports /demand
	 */
	function demand() {
		var self         = this || {},
			module       = isInstanceOf(self, Module) ? self : NULL,
			dependencies = arrayPrototypeSlice.call(arguments);

		dependencies.forEach(
			function(dependency, index) {
				var resolved = resolve.path(dependency, module),
					handler  = resolved.handler,
					path     = resolved.path,
					pointer  = modules[handler] || (modules[handler] = {});

				this[index] = pointer[path] || (pointer[path] = (new Loader(dependency, module)).pledge);
			},
			dependencies);

		return Pledge.all(dependencies);
	}

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
	 *
	 * @param {String} [path]
	 * @param {Function} definition
	 *
	 * @exports /provide
	 */
	function provide() {
		var path       = isTypeOf(arguments[0], STRING_STRING) ? arguments[0] : NULL,
			definition = !path ? arguments[0] : arguments[1],
			loader, dependencies;

		if(!path && queue.current) {
			loader = queue.current;
			path   = loader.handler + '!' + loader.path;
		}

		if(path) {
			// delay execution to be able to wait for "when" call
			setTimeout(function() {
				var resolved = resolve.path(path),
					pointer  = modules[resolved.handler],
					module, pledge, defered;

				if(!loader && pointer[resolved.path]) {
					log('duplicate found for module ' + resolved.path);
				} else {
					module = new Module(path, definition, dependencies || []);
					pledge = modules[module.handler][module.path] = module.pledge;

					if(loader) {
						loader.timeout = clearTimeout(loader.timeout);
						defered        = loader.defered;

						!loader.cached && loader.store();

						pledge.then(
							function() {
								defered.resolve.apply(NULL, arguments);
							},
							function() {
								defered.reject(new Error('unable to resolve module', path, arguments));
							}
						);

						queue.length > 0 && queue.next();
					}
				}
			});
		} else {
			throw new Error('unspecified anonymous provide');
		}

		// provide an Object with a "when" method to attach dependencies
		return { when: function() { dependencies = arrayPrototypeSlice.call(arguments); } };
	}

	/**
	 * alter demand configuration
	 *
	 * @param {Object} aConfig
	 */
	function configure(aConfig) {
		var aCache    = aConfig.cache,
			aDebug    = aConfig.debug,
			aVersion  = aConfig.version,
			aTimeout  = aConfig.timeout,
			aLifetime = aConfig.lifetime,
			aBase     = aConfig.base,
			aPattern  = aConfig.pattern,
			aProbes   = aConfig.probes,
			key;
				
		cache   = isTypeOf(aCache, STRING_BOOLEAN)  ? aCache   : cache;
		debug   = isTypeOf(aDebug, STRING_BOOLEAN)  ? aDebug   : debug;
		version = isTypeOf(aVersion, STRING_STRING) ? aVersion : version;

		if(isPositiveInteger(aTimeout)) {
			timeoutXhr   = Math.min(Math.max(aTimeout, 2), 10) * 1000;
			timeoutQueue = Math.min(Math.max(timeoutXhr / 5, 1000), 5000);
		}
				
		if(isPositiveInteger(aLifetime)) {
			lifetime = aLifetime * 1000;
		}
				
		if(isTypeOf(aBase, STRING_STRING)) {
			base = pattern.base = new Pattern('', resolve.url(aBase));
		}
				
		if(isObject(aPattern)) {
			for(key in aPattern) {
				key !== 'base' && (pattern[key] = new Pattern(key, aPattern[key]));
			}
		}
				
		if(isObject(aProbes)) {
			for(key in aProbes) {
				probes[key] = aProbes[key];
			}
		}

		return true;
	}

	/**
	 * add handler for mimetype
	 *
	 * @param {String} aType
	 * @param {String} aSuffix
	 * @param {Object} aHandler
	 */
	function addHandler(aType, aSuffix, aHandler) {
		if(!handler[aType]) {
			handler[aType] = { suffix: aSuffix, resolve: aHandler.resolve, modify: aHandler.modify };

			modules[aType] = {};
		}
	}

	/**
	 * Shortcut to globally provide internal functions
	 *
	 * @param {String} id
	 * @param {Function} factory
	 */
	function assign(id, factory) {
		provide(id, function() { return factory; });
	}

	/**
	 * Get the current timestamp
	 * 
	 * @returns {Number}
	 */
	function getTimestamp() {
		return +new Date();
	}

	/**
	 * add timestamp to a given URL
	 *
	 * @param {String} aUrl
	 *
	 * @returns {String}
	 */
	function addTimestamp(aUrl) {
		resolver.href = aUrl;

		var value = resolver.search,
			param = 'demand[timestamp]=' + getTimestamp();

		resolver.search += (value && value !== '?') ? '&' + param : '?' + param;

		return resolver.href;
	}

	/**
	 * log a message to the console
	 *
	 * @param {String|Error} aMessage
	 */
	function log(aMessage) {
		var type = (isInstanceOf(aMessage, Error)) ? 'error' : 'warn';

		if(!isTypeOf(console, STRING_UNDEFINED) && (debug || type !== 'warn')) {
			console[type](aMessage.toString());
		}
	}

	/**
	 * generate a new RegExp
	 *
	 * @param {String} expression
	 * @param {{String}} [modifier]
	 *
	 * @returns {RegExp}
	 */
	function regex(expression, modifier) {
		return new RegExp(expression, modifier);
	}

	/**
	 * escape a string to be used in a RegExp
	 *
	 * @param {String} aValue
	 *
	 * @returns {String}
	 */
	function escape(aValue) {
		return aValue.replace(regexMatchSpecial, '\\$&');
	}

	/**
	 * remove the protocol portion from any URL
	 *
	 * @param {String} url
	 *
	 * @returns {String}
	 */
	function removeProtocol(url) {
		return url.replace(regexMatchProtocol, '');
	}

	/**
	 * check whether a given path is absolute
	 *
	 * @param {String} aPath
	 *
	 * @returns {Boolean}
	 */
	function isAbsolute(aPath) {
		return regexIsAbsolute.test(aPath);
	}

	/**
	 * check whether a passed object is an instance of a certain type
	 *
	 * @param {*} object
	 * @param {*} module
	 *
	 * @returns {Boolean}
	 *
	 * @exports /validator/isInstanceOf
	 */
	function isInstanceOf(object, module) {
		return object instanceof module;
	}
			
	/**
	 * check wheter a given object is of a certain type
	 *
	 * @param {*} object
	 * @param {String} type
	 *
	 * @returns {Boolean}
	 *
	 * @exports /validator/isTypeOf
	 */
	function isTypeOf(object, type) {
		return typeof object === type;
	}

	/**
	 * check whether a given object is an object
	 *
	 * @param {*} object
	 *
	 * @returns {Boolean}
	 *
	 * @exports /validator/isObject
	 */
	function isObject(object) {
		return object && isTypeOf(object, 'object');
	}

	/**
	 * check whether a given value is a positive integer
	 *
	 * @param {*} value
	 *
	 * @returns {Boolean}
	 *
	 * @exports /validator/isPositiveInteger
	 */
	function isPositiveInteger(value) {
		return isTypeOf(value, 'number') && isFinite(value) && Math.floor(value) === value && value >= 0;
	}

	resolve = {
		/**
		 * resolve any given url
		 *
		 * @param {String} aUrl
		 *
		 * @returns {String}
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
		 * @param {String} aPath
		 * @param {Module} [aParent]
		 *
		 * @returns {void|{handler: string, path: string}}
		 */
		path: function(aPath, aParent) {
			var self     = this,
				pointer  = aPath.match(regexMatchHandler) || 'application/javascript',
				isLoader = isInstanceOf(self, Loader),
				key, match;
						
			if(!isTypeOf(pointer, STRING_STRING)) {
				aPath   = aPath.replace(regex('^' + escape(pointer[0])), '');
						
				pointer = pointer[1];
			}

			if(!isAbsolute(aPath)) {
				aPath = '/' + resolve.url(((aParent && aParent.path && resolve.url(aParent.path + '/../')) || '/') + aPath).replace(regexMatchUrl, '');
			}
					
			for(key in pattern) {
				pattern[key].matches(aPath) && (!match || match.weight < pattern[key].weight) && (match = pattern[key]);
			}
					
			if(isLoader || isInstanceOf(self, Module)) {
				self.handler = pointer;
				self.path    = aPath;
						
				isLoader && (self.url = removeProtocol(resolve.url(match.process(aPath))));
			} else {
				return { handler: pointer, path: aPath };
			}
		}
	};

	storage = {
		/**
		 * retrieve cache for a given path and URL
		 *
		 * @param {String} aPath
		 * @param {String} aUrl
		 *
		 * @returns {void|String}
		 */
		get: function(aPath, aUrl) {
			var id, state;

			if(localStorage && cache) {
				id    = DEMAND_PREFIX + '[' + aPath + ']';
				state = JSON.parse(localStorage.getItem(id + DEMAND_SUFFIX_STATE));

				if(state && state.version === version && state.url === aUrl && (state.expires === 0 || state.expires > getTimestamp)) {
					return localStorage.getItem(id + DEMAND_SUFFIX_VALUE);
				} else {
					storage.clear(aPath);
				}
			}
		},
		/**
		 * store cache for a given path, value and url
		 *
		 * @param {String} aPath
		 * @param {String} aValue
		 * @param {String} aUrl
		 */
		set: function(aPath, aValue, aUrl) {
			var id, spaceBefore;

			if(localStorage && cache) {
				id = DEMAND_PREFIX + '[' + aPath + ']';

				try {
					spaceBefore = hasRemainingSpace ? localStorage.remainingSpace : NULL;

					localStorage.setItem(id + DEMAND_SUFFIX_VALUE, aValue);
					localStorage.setItem(id + DEMAND_SUFFIX_STATE, JSON.stringify({ version: version, expires: lifetime > 0 ? getTimestamp + lifetime : 0, url: aUrl }));

					// strict equality check with "===" is required due to spaceBefore might be "0"
					if(spaceBefore !== NULL && localStorage.remainingSpace === spaceBefore) {
						throw 'QuotaExceedError';
					}
				} catch(error) {
					log('unable to cache module ' + aPath);
				}
			}
		},
		/**
		 * clear either a given path, all cached resources or only expired resources
		 *
		 * @param {String|Boolean} [aPath]
		 */
		clear: function(aPath) {
			var id, key, match, state;

			if(localStorage) {
				switch(typeof aPath) {
					// handle if aPath is of type "string" => clear specific
					case STRING_STRING:
						id = DEMAND_PREFIX + '[' + aPath + ']';

						localStorage.removeItem(id + DEMAND_SUFFIX_STATE);
						localStorage.removeItem(id + DEMAND_SUFFIX_VALUE);

						break;
					// handle if aPath is of type "boolean" and is truthy => clear expired
					case STRING_BOOLEAN:
						if(aPath) {
							for(key in localStorage) {
								match = key.match(regexMatchLsState);

								if(match) {
									state = JSON.parse(localStorage.getItem(DEMAND_PREFIX + '[' + match[1] + ']' + DEMAND_SUFFIX_STATE));

									if(state && state.expires > 0 && state.expires <= getTimestamp) {
										storage.clear(match[1]);
									}
								}
							}
						}

						break;
					// handle if aPath is of type "undefined" => clear all
					case STRING_UNDEFINED:
						for(key in localStorage) {
							key.indexOf(DEMAND_PREFIX) === 0 && (localStorage.removeItem(key));
						}

						break;
				}
			}
		}
	};

	JavascriptHandler = {
		/**
		 * handles resolving of JavaScript modules
		 *
		 * @param {String} aPath
		 * @param {String} aValue
		 */
		resolve: function(aPath, aValue) {
			var script = document.createElement('script');

			script.defer = script.async = true;
			script.text  = aValue;

			script.setAttribute('demand-path', aPath);

			target.appendChild(script);
		},
		/**
		 * handles modifying of JavaScript module's source prior to caching
		 *
		 * Rewrites sourcemap URL to an absolute URL in relation to the URL the module was loaded from
		 *
		 * @param {String} aUrl
		 * @param {String} aValue
		 *
		 * @returns {String}
		 */
		modify: function(aUrl, aValue) {
			var match, replacement;

			while(match = regexMatchSourcemap.exec(aValue)) {
				replacement = removeProtocol(resolve.url(aUrl + '/../' + match[1]));
				aValue      = aValue.replace(match[0], '//# sourcemap=' + replacement + '.map');
			}

			return aValue;
		}
	};

	CssHandler = {
		/**
		 * handles resolving of CSS modules
		 *
		 * @param {String} aPath
		 * @param {String} aValue
		 */
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
		/**
		 * handles modifying of CSS module's source prior to caching
		 *
		 * Rewrites relative CSS URLs to an absolute URL in relation to the URL the module was loaded from
		 *
		 * @param {String} aUrl
		 * @param {String} aValue
		 *
		 * @returns {String}
		 */
		modify: function(aUrl, aValue) {
			var base = resolve.url(aUrl + '/..'),
				match;

			while((match = regexMatchCssUrl.exec(aValue))) {
				aValue = aValue.replace(match[0], 'url(' + resolve.url(base + match[1]) + ')');
			}

			return aValue;
		}
	};

	/**
	 * provides promise like behaviour
	 *
	 * unlike native Promises and polyfills a Pledge
	 * can be resolved and rejected with multiple values
	 * which will all get applied
	 *
	 * @param {Function} executor
	 *
	 * @constructor
	 * @exports /pledge
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
			if(self.state === PLEDGE_PENDING) {
				self.state = aState;
				self.value = aParameter;

				listener[aState].forEach(function(aHandler) {
					aHandler.apply(NULL, self.value);
				});
			}
		}

		self.then = function(aResolved, aRejected) {
			if(self.state === PLEDGE_PENDING) {
				aResolved && listener[PLEDGE_RESOLVED].push(aResolved);
				aRejected && listener[PLEDGE_REJECTED].push(aRejected);
			} else {
				switch(self.state) {
					case PLEDGE_RESOLVED:
						aResolved.apply(NULL, self.value);

						break;
					case PLEDGE_REJECTED:
						aRejected.apply(NULL, self.value);

						break;
				}
			}
		};

		executor(resolve, reject);
	}

	Pledge.prototype = {
		constructor: Pledge,
		state:       PLEDGE_PENDING,
		value:       NULL,
		listener:    NULL,
		then:        NULL
	};

	/**
	 * provides Promise.defer like behaviour
	 *
	 * @returns {Object}
	 */
	Pledge.defer = function() {
		var self = {};

		self.pledge = new Pledge(function(aResolve, aReject) {
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
	 * @param {Object[]} aPledges
	 *
	 * @returns {Pledge}
	 */
	Pledge.all = function(aPledges) {
		var defered       = Pledge.defer(),
			pledge        = defered.pledge,
			resolved      = [],
			rejected      = [],
			countTotal    = aPledges.length,
			countResolved = 0;

		aPledges.forEach(function(aPledge, aIndex) {
			aPledge.then(
				function() {
					resolved[aIndex] = arrayPrototypeSlice.call(arguments);

					countResolved++;

					countResolved === countTotal && defered.resolve.apply(NULL, arrayPrototypeConcat.apply([], resolved));
				},
				function() {
					rejected.push(arrayPrototypeSlice.call(arguments));

					rejected.length + countResolved === countTotal && defered.reject.apply(NULL, arrayPrototypeConcat.apply([], rejected));
				}
			);
		});

		return pledge;
	};

	/**
	 * provides Promise.race like behaviour
	 *
	 * @param {Object[]} aPledges
	 *
	 * @returns {Pledge}
	 */
	Pledge.race = function(aPledges) {
		var defered = Pledge.defer();

		aPledges.forEach(function(aPledge) {
			aPledge.then(
				defered.resolve,
				defered.reject
			);
		});

		return defered.pledge;
	};

	/**
	 * internal error class
	 *
	 * @param {String} aMessage
	 * @param {String} [aModule]
	 * @param {Object[]} [aStack]
	 *
	 * @constructor
	 */
	function Error(aMessage, aModule, aStack) {
		var self = this;

		self.message = aMessage;

		aModule && (self.module  = aModule);
		aStack && (self.stack = arrayPrototypeSlice.call(aStack));
	}

	Error.prototype = {
		message: NULL,
		module:  NULL,
		stack:   NULL,
		/**
		 * handles output to console
		 *
		 * @returns {String}
		 */
		toString: function() {
			var self   = this,
				result = DEMAND_PREFIX + ' ' + self.message + ' ' + self.module;

			if(self.stack) {
				result = Error.traverse(self.stack, result, 1);
			}

			return result;
		}
	};

	/**
	 * handles recursion of stack on output to console
	 *
	 * @param {Object[]} stack
	 * @param {String} value
	 * @param {Number} depth
	 *
	 * @returns {String}
	 */
	Error.traverse = function(stack, value, depth) {
		var indention = new Array(depth + 1).join(' ');

		stack.forEach(function(item) {
			value += '\n' + indention + '> ' + item.message + ' ' + item.module;

			if(item.stack) {
				value = Error.traverse(item.stack, value, depth + 1);
			}
		});

		return value;
	};

	/**
	 * abstraction for pattern matching of paths
	 *
	 * @param {String} aPattern
	 * @param {String} aUrl
	 *
	 * @constructor
	 */
	function Pattern(aPattern, aUrl) {
		var self = this;

		self.weight       = aPattern.length;
		self.url          = resolve.url(aUrl);
		self.regexPattern = regex('^' + escape(aPattern));
		self.regexUrl     = regex('^' + escape(aUrl));
	}

	Pattern.prototype = {
		weight:       0,
		url:          NULL,
		regexPattern: NULL,
		regexUrl:     NULL,
		/**
		 * check whether a given path matches the pattern
		 *
		 * @param {String} aPath
		 *
		 * @returns {Boolean}
		 */
		matches: function(aPath) {
			return this.regexPattern.test(aPath);
		},
		/**
		 * remove this pattern's URL from a given URL
		 *
		 * @param {String} aUrl
		 *
		 * @returns {String}
		 */
		remove: function(aUrl) {
			return aUrl.replace(this.regexUrl, '');
		},
		/**
		 * process this pattern for a given path
		 *
		 * @param {String} aPath
		 *
		 * @returns {String}
		 */
		process: function(aPath) {
			var self = this;

			return aPath.replace(self.regexPattern, self.url);
		}
	};

	/**
	 * Queue handling for anonymous (loaded) modules
	 *
	 * @constructor
	 */
	function Queue() {
		var self = this;

		self.current = NULL;
		self.queue   = [];
	}

	Queue.prototype = {
		current: NULL,
		queue:   NULL,
		length:  0,
		/**
		 * add an item to the queue
		 *
		 * @param {Loader} aItem
		 */
		add: function(aItem) {
			var self  = this,
				queue = self.queue;

			queue.push(aItem);

			self.length++;

			queue.length === 1 && self.next();
		},
		/**
		 * process the queue
		 */
		next: function() {
			var self    = this,
				current = self.current,
				queue   = self.queue,
				defered, path, pointer;

			if(current) {
				self.current = NULL;

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

				current.timeout = setTimeout(function() {
					defered.reject(new Error('timeout resolving module', path));
				}, timeoutQueue);
			}
		}
	};

	/**
	 * module loader
	 *
	 * @param {String} aPath
	 * @param {Module} [aParent]
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

		if(!aParent) {
			self.pledge.then(NULL, log);
		}

		if(pointer) {
			self.retrieve();

			if(self.cached) {
				queue.add(self);
			} else {
				xhr            = regexMatchUrl.test(self.url) ? new XHR() : new XDR();
				xhr.onprogress = function() {};
				xhr.ontimeout  = xhr.onerror = xhr.onabort = function() { defered.reject(new Error('unable to load module', self.path)); };
				xhr.onload     = function() { self.timeout = clearTimeout(self.timeout); self.source = xhr.responseText; queue.add(self);};

				xhr.open('GET', addTimestamp(self.url + pointer.suffix), true);
				xhr.send();

				self.timeout = setTimeout(function() { if(xhr.readyState < 4) { xhr.abort(); } }, timeoutXhr);
			}
		} else {
			defered.reject(new Error('no handler "' + self.handler + '" for', self.path));
		}
	}

	Loader.prototype = {
		handler: NULL,
		path:    NULL,
		url:     NULL,
		defered: NULL,
		pledge:  NULL,
		cached:  NULL,
		source:  NULL,
		timeout: NULL,
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

	/**
	 * module
	 *
	 * @param {String} aPath
	 * @param {Function} aDefinition
	 * @param {Object[]} aDependencies
	 *
	 * @constructor
	 */
	function Module(aPath, aDefinition, aDependencies) {
		var self    = this,
			defered = Pledge.defer();

		resolve.path.call(self, aPath);

		(self.pledge = defered.pledge).then(NULL, function() {
			log(new Error('unable to resolve module', self.path, arguments));
		});

		if(aDependencies.length > 0) {
			demand.apply(self, aDependencies)
				.then(
					function() { defered.resolve(aDefinition.apply(NULL, arguments)); },
					function() { defered.reject(new Error('unable to resolve dependencies for', self.path, arguments)); }
				);
		} else {
			defered.resolve(aDefinition());
		}
	}

	Module.prototype = {
		handler: NULL,
		path:    NULL,
		pledge:  NULL
	};

	// initialization
		// regex
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
			configure(defaults) && configSettings && configure(configSettings);

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
		if(configMain) {
			demand(configMain);
		}
}(this, document, setTimeout, clearTimeout, localStorage, XMLHttpRequest, demand.main, demand.settings));