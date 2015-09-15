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

;(function(global, document, localStorage, JSON, XMLHttpRequest, setTimeout, clearTimeout, config) {
	'use strict';

	var // shortcuts
			arrayPrototypeSlice     = Array.prototype.slice,
			arrayPrototypeConcat    = Array.prototype.concat,
			target                  = document.getElementsByTagName('head')[0],
			resolver                = document.createElement('a'),
		// constants
			DEMAND_ID               = 'demand',
			DEMAND_PREFIX           = '[' + DEMAND_ID + ']',
			DEMAND_SUFFIX_STATE     = '[state]',
			DEMAND_SUFFIX_VALUE     = '[value]',
			DEMAND_PREFIX_HANDLER   = '/' + DEMAND_ID + '/handler/',
			DEMAND_PREFIX_STORAGE   = '/' + DEMAND_ID + '/storage/',
			DEMAND_PREFIX_VALIDATOR = '/validator/',
			STRING_UNDEFINED        = 'undefined',
			STRING_STRING           = 'string',
			STRING_BOOLEAN          = 'boolean',
			PLEDGE_PENDING          = 'pending',
			PLEDGE_RESOLVED         = 'resolved',
			PLEDGE_REJECTED         = 'rejected',
			NULL                    = null,
			XHR                     = XMLHttpRequest,
			XDR                     = 'XDomainRequest' in global &&  global.XDomainRequest || XHR,
		// regular expressions
			regexIsAbsolute         = /^\//i,
			regexMatchHandler       = /^([-\w]+\/?)+!/,
			regexMatchSpecial       = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
			regexMatchSourcemap     = /\/\/#\s+sourceMappingURL\s*=\s*(.+?)\.map/g,
			regexMatchProtocol      = /^http(s?):/,
			regexMatchFull          = /^(http(s?):|)\/\//,
			regexMatchUrl, regexMatchLsState,
		// flags
			hasRemainingSpace       = localStorage && 'remainingSpace' in localStorage,
		// general storage & objects
			defaults                = { cache: true, storage: 'localstorage', handler: 'js', debug: false, version: '1.0.0', lifetime: 0, timeout: 5, base: '/' },
			modules                 = {},
			pattern                 = {},
			probes                  = {},
			queue, resolve, storageAdapter,
		// handler
			handlerJavascript,
		// storage
			storageLocalstorage,
		// configuration
			base, cache, storage, debug, timeoutXhr, timeoutQueue, version, lifetime;

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
	 * @returns {Pledge}
	 *
	 * @exports /demand
	 */
	function demand() {
		var self         = this,
			defered      = Pledge.defer(),
			context      = isInstanceOf(self, Module) || isInstanceOf(self, Loader) ? self : NULL,
			dependencies = arrayPrototypeSlice.call(arguments);

		setTimeout(function() {
			dependencies.forEach(resolveDependency, context);
			
			Pledge.all(dependencies)
				.then(
					defered.resolve,
					defered.reject
				);
		});

		return defered.pledge;
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
	 * @returns {void|{when: Function}}
	 *
	 * @exports /provide
	 */
	function provide() {
		var self       = this,
			context    = isInstanceOf(self, Module) || isInstanceOf(self, Loader) ? self : NULL,
			path       = isTypeOf(arguments[0], STRING_STRING) ? arguments[0] : NULL,
			definition = !path ? arguments[0] : arguments[1],
			loader, dependencies;

		if(!path && queue.current) {
			loader = queue.current;
			path   = loader.type + '!' + loader.path;
		}

		if(path) {
			setTimeout(function() {
				var resolved = resolve.path(path, context),
					pointer  = modules[resolved.type] || (modules[resolved.type] = {}),
					module, pledge, defered;

				if(loader || !pointer[resolved.path]) {
					module = new Module(resolved.path, definition, dependencies);
					pledge = modules[module.type][module.path] = module.pledge;

					if(loader) {
						loader.timeout = clearTimeout(loader.timeout);
						defered        = loader.defered;

						pledge.then(
							defered.resolve,
							function() {
								defered.reject(new Error('unable to resolve module', path, arguments));
							}
						);

						!loader.cached && loader.store();
						queue.length > 0 && queue.next();
					}
				} else {
					log('duplicate found for module ' + resolved.path);
				}
			});

			return { when: function() { dependencies = arguments; } };
		} else {
			throw new Error('unspecified anonymous provide');
		}
	}

	/**
	 * alter demand configuration
	 *
	 * @param {Object} aConfig
	 */
	function configure(aConfig) {
		var aCache    = aConfig.cache,
			aStorage  = aConfig.storage,
			aDebug    = aConfig.debug,
			aVersion  = aConfig.version,
			aTimeout  = aConfig.timeout,
			aLifetime = aConfig.lifetime,
			aBase     = aConfig.base,
			aPattern  = aConfig.pattern,
			aProbes   = aConfig.probes,
			key;

		cache   = isTypeOf(aCache, STRING_BOOLEAN)  ? aCache   : cache;
		storage = isTypeOf(aStorage, STRING_STRING) ? aStorage : storage;
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
	 * resolve dependency names to existing Modules or a new Loader
	 *
	 * @param {String} dependency
	 * @param {Number} index
	 * @param {Object[]} dependencies
	 */
	function resolveDependency(dependency, index, dependencies) {
		var self     = this,
			resolved = resolve.path(dependency, self),
			type     = resolved.type,
			path     = resolved.path,
			pointer  = modules[type] || (modules[type] = {});

		dependencies[index] = pointer[path] || (pointer[path] = (new Loader(dependency, self)).pledge);
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
		 * @param {Module|Loader} [aParent]
		 *
		 * @returns {void|{type: String, path: String}}
		 */
		path: function(aPath, aParent) {
			var self     = this,
				pointer  = aPath.match(regexMatchHandler) || defaults.handler,
				isLoader = isInstanceOf(self, Loader),
				key, match;

			if(!isTypeOf(pointer, STRING_STRING)) {
				aPath   = aPath.replace(regex('^' + escape(pointer[0])), '');

				pointer = pointer[1];
			}

			if(!regexMatchFull.test(aPath)) {
				if(!isAbsolute(aPath)) {
						aPath = '/' + resolve.url(((aParent && aParent.path && resolve.url(aParent.path + '/../')) || '/') + aPath).replace(regexMatchUrl, '');
				}

				for(key in pattern) {
					pattern[key].matches(aPath) && (!match || match.weight < pattern[key].weight) && (match = pattern[key]);
				}
			}

			if(isLoader || isInstanceOf(self, Module)) {
				self.type = pointer;
				self.path = aPath;

				isLoader && (self.url = match ? removeProtocol(resolve.url(match.process(aPath))) : aPath);
			} else {
				return { type: pointer, path: aPath };
			}
		}
	};

	storageLocalstorage = {
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

			if(localStorage) {
				id    = DEMAND_PREFIX + '[' + aPath + ']';
				state = JSON.parse(localStorage.getItem(id + DEMAND_SUFFIX_STATE));

				if(state && state.version === version && state.url === aUrl && (state.expires === 0 || state.expires > getTimestamp)) {
					return localStorage.getItem(id + DEMAND_SUFFIX_VALUE);
				} else {
					storageLocalstorage.clear.path(aPath);
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

			if(localStorage) {
				id = DEMAND_PREFIX + '[' + aPath + ']';

				try {
					spaceBefore = hasRemainingSpace ? localStorage.remainingSpace : NULL;

					localStorage.setItem(id + DEMAND_SUFFIX_VALUE, aValue);
					localStorage.setItem(id + DEMAND_SUFFIX_STATE, JSON.stringify({ version: version, expires: lifetime > 0 ? getTimestamp + lifetime : 0, url: aUrl }));

					// strict equality check with "===" is required due to spaceBefore might be "0"
					if(spaceBefore !== NULL && localStorage.remainingSpace === spaceBefore) {
						throw 'QUOTA_EXCEEDED_ERR';
					}
				} catch(error) {
					log('unable to cache module ' + aPath);
				}
			}
		},
		/**
		 * clear either a given path, all cached  or expired resources
		 *
		 * @param {String|Boolean} [aPath]
		 */
		clear: {
			path: function(aPath) {
				var id;

				if(localStorage) {
					id = DEMAND_PREFIX + '[' + aPath + ']';

					localStorage.removeItem(id + DEMAND_SUFFIX_STATE);
					localStorage.removeItem(id + DEMAND_SUFFIX_VALUE);
				}
			},
			all: function() {
				var key;

				if(localStorage) {
					for(key in localStorage) {
						key.indexOf(DEMAND_PREFIX) === 0 && (localStorage.removeItem(key));
					}
				}
			},
			expired: function() {
				var key, match, state;

				if(localStorage) {
					for(key in localStorage) {
						match = key.match(regexMatchLsState);

						if(match) {
							state = JSON.parse(localStorage.getItem(DEMAND_PREFIX + '[' + match[1] + ']' + DEMAND_SUFFIX_STATE));

							if(state && state.expires > 0 && state.expires <= getTimestamp) {
								storageLocalstorage.clear.path(match[1]);
							}
						}
					}
				}
			}
		}
	};

	function scopify(scope, aDefinition, aArguments) {
		var constructorArgs = [ 'demand', 'provide' ],
			definition      = aDefinition.toString(),
			defined         = definition.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/im)[1].replace(' ', ''),
			scopedDemand, scopedProvide;

		scopedDemand           = demand.bind(scope);
		scopedDemand.configure = demand.configure;
		scopedDemand.clear     = demand.clear;
		scopedProvide          = provide.bind(scope);

		if(defined) {
			constructorArgs = constructorArgs.concat(defined.split(','));
		}

		constructorArgs.push(definition.substring(definition.indexOf('{') + 1, definition.lastIndexOf('}')));


		//return Function.apply(NULL, constructorArgs).apply(NULL, [ scopedDemand, scopedProvide ].concat(arrayPrototypeSlice.call(aArguments)));


		/*
		 return (function(demand, provide) {
		 return aDefinition.apply(NULL, aArguments);
		 }(scopedDemand, scopedProvide));
		 */
	}

	handlerJavascript = {
		/**
		 * Enables modification of the URL that gets requested
		 *
		 * @param {String} aUrl
		 *
		 * @returns {String}
		 */
		prepare: function(aUrl) {
			return aUrl.slice(-3) !== '.js' ? aUrl + '.js' : aUrl;
		},
		/**
		 * handles resolving of JavaScript modules
		 *
		 * @param {Loader} aLoader
		 */
		resolve: function(aLoader) {
			var path   = aLoader.path,
				source = aLoader.source,
				scopedDemand, script;

			if(probes[path]) {
				script       = document.createElement('script');
				script.async = true;
				script.text  = source;

				script.setAttribute('demand-path', path);

				target.appendChild(script);
			} else {
				scopedDemand           = demand.bind(aLoader);
				scopedDemand.configure = demand.configure;
				scopedDemand.clear     = demand.clear;

				var func = new Function('demand', 'provide', source);

				console.log('here ', func);

				/* jshint evil: true */
				func.call(NULL, scopedDemand, provide.bind(aLoader));
				/* jshint evil: false */
			}
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
					aHandler.apply(NULL, aParameter);
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
				defered, path, handler;

			if(current) {
				self.current = NULL;

				queue.shift();
				self.length--;
			}

			if(queue.length) {
				current = self.current = self.queue[0];
				defered = current.defered;
				path    = current.path;
				handler = current.handler;

				!current.cached && handler.modify && (current.source = handler.modify(current.url, current.source));

				handler.resolve(current);

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
			xhr;

		resolve.path.call(self, aPath, aParent);

		self.defered = defered;
		self.pledge  = defered.pledge;

		if(!aParent) {
			self.pledge.then(NULL, log);
		}
		
		demand(DEMAND_PREFIX_HANDLER + self.type)
			.then(
				function(handler) {
					self.retrieve();

					self.handler = handler;

					if(self.cached) {
						queue.add(self);
					} else {
						xhr            = regexMatchUrl.test(self.url) ? new XHR() : new XDR();
						xhr.onprogress = function() {};
						xhr.ontimeout  = xhr.onerror = xhr.onabort = function() { defered.reject(new Error('unable to load module', self.path)); };
						xhr.onload     = function() {
							self.timeout = clearTimeout(self.timeout);

							if(!('status' in xhr) || xhr.status === 200) {
								self.source = xhr.responseText;

								queue.add(self);
							} else {
								defered.reject(new Error('unable to load module', self.path));
							}
						};

						xhr.open('GET', addTimestamp(handler.prepare(self.url)), true);
						xhr.send();

						self.timeout = setTimeout(function() { if(xhr.readyState < 4) { xhr.abort(); } }, timeoutXhr);
					}
				},
				defered.reject
			);
	}

	Loader.prototype = {
		handler: NULL,
		url:     NULL,
		defered: NULL,
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
					setTimeout(self.probe.bind(self), 10);
				}
			}
		},
		/**
		 * store loaders result in localStorage
		 */
		store: function() {
			var self = this;

			cache && storageAdapter.set(self.path, self.source, self.url);
		},
		/**
		 * retrieve cache for loader
		 */
		retrieve: function() {
			var self   = this,
				source = cache && storageAdapter.get(self.path, self.url),
				cached = self.cached = !!(source);

			cached && (self.source = source);
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

		if(aDependencies && aDependencies.length > 0) {
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
		type:    NULL,
		path:    NULL,
		pledge:  NULL
	};

	// initialization
		// regex
			regexMatchUrl     = regex('^' + escape(resolve.url('/')));
			regexMatchLsState = regex('^' + escape(DEMAND_PREFIX + '\[(.+?)\]' + DEMAND_SUFFIX_STATE + '$'));

		// create queue
			queue = new Queue();

		// add pattern for "/demand" to point to original demand URL
			pattern['/' + DEMAND_ID] = new Pattern('/' + DEMAND_ID, resolve.url(((config && config.url) || location.href) + '/../').slice(0, -1));

		// configure
			configure(defaults) && config && config.settings && configure(config.settings);

		// register in global scope
			demand.configure  = configure;
			global.demand     = demand;
			global.provide    = provide;

		// register modules
			assign('/' + DEMAND_ID, demand);
			assign('/provide', provide);
			assign('/pledge', Pledge);
			assign('/resolve/url', resolve.url);
			assign(DEMAND_PREFIX_VALIDATOR + 'isObject', isObject);
			assign(DEMAND_PREFIX_VALIDATOR + 'isTypeOf', isTypeOf);
			assign(DEMAND_PREFIX_VALIDATOR + 'isInstanceOf', isInstanceOf);
			assign(DEMAND_PREFIX_VALIDATOR + 'isPositiveInteger', isPositiveInteger);
			assign(DEMAND_PREFIX_STORAGE + defaults.storage, storageLocalstorage);
			assign(DEMAND_PREFIX_HANDLER + defaults.handler, handlerJavascript);

	// load main script
		demand(DEMAND_PREFIX_STORAGE + storage)
			.then(
				function(adapter) {
					storageAdapter = adapter;
					demand.clear   = storageAdapter.clear;

					storageAdapter.clear.expired();

					if(config && config.main) {
						demand(config.main);
					}
				}
			);
}(this, document, (function() { try { return 'localStorage' in this && localStorage; } catch(exception) { return false; } }()), JSON, XMLHttpRequest, setTimeout, clearTimeout, 'demand' in this && demand));