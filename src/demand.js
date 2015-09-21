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

;(function(global, document, localStorage, JSON, XMLHttpRequest, setTimeout, clearTimeout, snippetParameter) {
	'use strict';

	var // shortcuts
			arrayPrototypeSlice     = Array.prototype.slice,
			arrayPrototypeConcat    = Array.prototype.concat,
			target                  = document.getElementsByTagName('head')[0],
			resolver                = document.createElement('a'),
		// constants
			PROVIDE_ID              = 'provide',
			DEMAND_ID               = 'demand',
			SETTINGS_ID             = 'settings',
			DEMAND_PREFIX           = '/' + DEMAND_ID + '/',
			DEMAND_PREFIX_SCOPED    = DEMAND_PREFIX + 'scoped/',
			DEMAND_PREFIX_HANDLER   = DEMAND_PREFIX + 'handler/',
			DEMAND_PREFIX_STORAGE   = DEMAND_PREFIX + 'storage/',
			DEMAND_PREFIX_VALIDATOR = DEMAND_PREFIX + 'validator/',
			STORAGE_PREFIX          = '[' + DEMAND_ID + ']',
			STORAGE_SUFFIX_STATE    = '[state]',
			STORAGE_SUFFIX_VALUE    = '[value]',
			STRING_UNDEFINED        = 'undefined',
			STRING_STRING           = 'string',
			STRING_BOOLEAN          = 'boolean',
			PLEDGE_PENDING          = 'pending',
			PLEDGE_RESOLVED         = 'resolved',
			PLEDGE_REJECTED         = 'rejected',
			FUNCTION_EMPTY          = function() {},
			NULL                    = null,
			XHR                     = XMLHttpRequest,
			XDR                     = 'XDomainRequest' in global &&  global.XDomainRequest || XHR,
		// regular expressions
			regexIsAbsolute         = /^\//i,
			regexMatchParameter     = /^((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/,
			regexMatchSpecial       = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
			regexMatchSourcemap     = /\/\/#\s+sourceMappingURL\s*=\s*(.+?)\.map/g,
			regexMatchProtocol      = /^http(s?):/,
			regexMatchFull          = /^(http(s?):|)\/\//,
			regexMatchUrl, regexMatchLsState,
		// flags
			hasRemainingSpace       = localStorage && 'remainingSpace' in localStorage,
		// general storage & objects
			defaults                = { cache: true, storage: 'localstorage', handler: 'js', debug: false, timeout: 5, base: '/' },
			modules                 = {},
			defereds                = {},
			pattern                 = {},
			probes                  = {},
			settings                = { modules: {} },
			queue, resolve, storageAdapter,
		// predefined modules
			handlerJavascript, storageLocalstorage;

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
			context      = isInstanceOf(self, Module) || isInstanceOf(self, Loader) ? self : NULL,
			dependencies = arrayPrototypeSlice.call(arguments);

		dependencies.forEach(resolveDependency, context);

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
	 * @returns {void|{when: Function}}
	 *
	 * @exports /provide
	 */
	function provide() {
		var self       = this,
			context    = isInstanceOf(self, Module) || isInstanceOf(self, Loader) ? self : NULL,
			path       = isTypeOf(arguments[0], STRING_STRING) ? arguments[0] : NULL,
			definition = !path ? arguments[0] : arguments[1],
			loader, dependencies, resolved, type, dPointer, mPointer;

		if(queue.current && (!path || path === queue.current.path)) {
			loader = queue.current;
			path   = loader.type + '!' + loader.path;
		}

		if(path) {
			resolved = resolve.path(path, context);
			type     = resolved.type;
			path     = resolved.path;
			dPointer = defereds[type] || (defereds[type] = {});
			mPointer = modules[type] || (modules[type] = {});

			if(!mPointer[path] || loader) {
				if(!loader) {
					dPointer[path] = Pledge.defer();
					mPointer[path] = dPointer[path].pledge;
				}

				setTimeout(function() {
					new Module(type + '!' + path, definition, dependencies);

					if(loader) {
						loader.timeout = clearTimeout(loader.timeout);

						if(isTypeOf(loader.cached, STRING_BOOLEAN)) {
							loader.pledge.cache = loader.cached ? 'hit' : 'miss';
						}

						!loader.cached && loader.store();
						queue.items > 0 && queue.process();
					}
				});

				return { when: function() { dependencies = arguments; } };
			} else {
				log('duplicate found for module ' + resolved.path);

				return { when: FUNCTION_EMPTY };
			}
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
			aModules  = aConfig.modules,
			key;

		settings.cache   = isTypeOf(aCache, STRING_BOOLEAN)  ? aCache   : settings.cache;
		settings.storage = isTypeOf(aStorage, STRING_STRING) ? aStorage : settings.storage;
		settings.debug   = isTypeOf(aDebug, STRING_BOOLEAN)  ? aDebug   : settings.debug;

		if(isTypeOf(aVersion, STRING_STRING)) {
			settings.version = aVersion;
		}

		if(isPositiveInteger(aTimeout)) {
			settings.timeout   = Math.min(Math.max(aTimeout, 2), 10) * 1000;
		}

		if(isPositiveInteger(aLifetime) && aLifetime > 0) {
			settings.lifetime = aLifetime * 1000;
		}

		if(isTypeOf(aBase, STRING_STRING)) {
			pattern.base = new Pattern('', resolve.url(aBase));
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

		if(isObject(aModules)) {
			for(key in aModules) {
				settings.modules[key] = aModules[key];
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
	 *
	 * @this Module|Loader
	 */
	function resolveDependency(dependency, index, dependencies) {
		var self     = this,
			resolved = resolve.path(dependency, self),
			type     = resolved.type,
			path     = resolved.path,
			mPointer = modules[type] || (modules[type] = {}),
			definition;

		if(!defereds[type]) {
			defereds[type] = {};
		}

		if(self && (dependency === DEMAND_ID || dependency === PROVIDE_ID || dependency === SETTINGS_ID) && !mPointer[path]) {
			switch(dependency) {
				case DEMAND_ID:
					path = DEMAND_PREFIX_SCOPED + DEMAND_ID + path;

					definition = function() {
						var scopedDemand = demand.bind(self);

						scopedDemand.configure = demand.configure;
						scopedDemand.clear     = demand.clear;
						scopedDemand.list      = demand.list;

						return scopedDemand;
					};

					break;
				case PROVIDE_ID:
					path = DEMAND_PREFIX_SCOPED + PROVIDE_ID + path;

					definition = function() {
						return provide.bind(self);
					};

					break;
				case SETTINGS_ID:
					path = DEMAND_PREFIX_SCOPED + SETTINGS_ID + self.path;

					definition = function() {
						return settings.modules[self.path] || NULL;
					};

					break;
			}

			provide(path, definition);
		}

		dependencies[index] = mPointer[path] || (mPointer[path] = (new Loader(dependency, self)).pledge);
	}

	/**
	 * Shortcut to globally provide internal functions as modules
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

		/* jshint ignore:start */
		if(!isTypeOf(console, STRING_UNDEFINED) && (settings.debug || type !== 'warn')) {
			console[type](aMessage.toString());
		}
		/* jshint ignore:end */
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
	 * @exports /demand/validator/isInstanceOf
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
	 * @exports /demand/validator/isTypeOf
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
	 * @exports /demand/validator/isObject
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
	 * @exports /demand/validator/isPositiveInteger
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
				parameter = aPath.match(regexMatchParameter),
				type      = (parameter && parameter[1]) || defaults.handler,
				version   = (parameter && parameter[2]) || settings.version,
				lifetime  = (parameter && parameter[3]) || settings.lifetime,
				isLoader = isInstanceOf(self, Loader),
				key, match;

			parameter && (aPath = aPath.replace(regexMatchParameter, ''));

			if(!regexMatchFull.test(aPath)) {
				if(!isAbsolute(aPath)) {
						aPath = '/' + resolve.url(((aParent && aParent.path && resolve.url(aParent.path + '/../')) || '/') + aPath).replace(regexMatchUrl, '');
				}

				for(key in pattern) {
					pattern[key].matches(aPath) && (!match || match.weight < pattern[key].weight) && (match = pattern[key]);
				}
			}

			if(isLoader || isInstanceOf(self, Module)) {
				self.type = type;
				self.path = aPath;

				if(isLoader) {
					self.version  = version;
					self.lifetime = lifetime;
					self.url      = match ? removeProtocol(resolve.url(match.process(aPath))) : aPath;
				}
			} else {
				return { type: type, path: aPath };
			}
		}
	};

	storageLocalstorage = {
		/**
		 * retrieve cache for a given path and URL
		 *
		 * @param {Loader} aLoader
		 *
		 * @returns {void|String}
		 */
		get: function(aLoader) {
			var path, id, state;

			if(localStorage) {
				path  = aLoader.path;
				id    = STORAGE_PREFIX + '[' + path + ']';
				state = JSON.parse(localStorage.getItem(id + STORAGE_SUFFIX_STATE));

				if(state && state.version === aLoader.version && state.url === aLoader.url && ((!state.expires && !aLoader.lifetime) || state.expires > getTimestamp())) {
					return localStorage.getItem(id + STORAGE_SUFFIX_VALUE);
				} else {
					storageLocalstorage.clear.path(path);
				}
			}
		},
		/**
		 * store cache for a given path, value and url
		 *
		 * @param {Loader} aLoader
		 */
		set: function(aLoader) {
			var path, lifetime, id, spaceBefore;

			if(localStorage) {
				path     = aLoader.path;
				lifetime = aLoader.lifetime;
				id       = STORAGE_PREFIX + '[' + path + ']';

				try {
					spaceBefore = hasRemainingSpace ? localStorage.remainingSpace : NULL;

					localStorage.setItem(id + STORAGE_SUFFIX_VALUE, aLoader.source);
					localStorage.setItem(id + STORAGE_SUFFIX_STATE, JSON.stringify({ version: aLoader.version, expires: lifetime ? getTimestamp() + lifetime : lifetime, url: aLoader.url }));

					// strict equality check with "===" is required due to spaceBefore might be "0"
					if(spaceBefore !== NULL && localStorage.remainingSpace === spaceBefore) {
						throw 'QUOTA_EXCEEDED_ERR';
					}
				} catch(error) {
					log('unable to cache module ' + path);
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
					id = STORAGE_PREFIX + '[' + aPath + ']';

					localStorage.removeItem(id + STORAGE_SUFFIX_STATE);
					localStorage.removeItem(id + STORAGE_SUFFIX_VALUE);
				}
			},
			all: function() {
				var key;

				if(localStorage) {
					for(key in localStorage) {
						key.indexOf(STORAGE_PREFIX) === 0 && (localStorage.removeItem(key));
					}
				}
			},
			expired: function() {
				var key, match, state;

				if(localStorage) {
					for(key in localStorage) {
						match = key.match(regexMatchLsState);

						if(match) {
							state = JSON.parse(localStorage.getItem(STORAGE_PREFIX + '[' + match[1] + ']' + STORAGE_SUFFIX_STATE));

							if(state && state.expires > 0 && state.expires <= getTimestamp()) {
								storageLocalstorage.clear.path(match[1]);
							}
						}
					}
				}
			}
		}
	};

	handlerJavascript = {
		/**
		 * Enables modification of the URL that gets requested
		 *
		 * @this Loader
		 */
		onPreRequest: function() {
			var self = this,
				url  = self.url;

			self.url = url.slice(-3) !== '.js' ? url + '.js' : url;
		},
		/**
		 * handles modifying of JavaScript module's source prior to caching
		 *
		 * Rewrites sourcemap URL to an absolute URL in relation to the URL the module was loaded from
		 *
		 * @this Loader
		 */
		onPostRequest: function() {
			var self   = this,
				url    = self.url,
				source = self.source,
				match, replacement;

			while(match = regexMatchSourcemap.exec(source)) {
				replacement = removeProtocol(resolve.url(url + '/../' + match[1]));
				source      = source.replace(match[0], '//# sourcemap=' + replacement + '.map');
			}

			self.source = source;
		},
		/**
		 * handles resolving of JavaScript modules
		 *
		 * @this Loader
		 */
		onPostProcess: function() {
			var self   = this,
				source = self.source,
				script;

			script       = document.createElement('script');
			script.async = true;
			script.text  = source;

			script.setAttribute('demand-type', self.type);
			script.setAttribute('demand-path', self.path);

			target.appendChild(script);
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
						aResolved && aResolved.apply(NULL, self.value);

						break;
					case PLEDGE_REJECTED:
						aRejected && aRejected.apply(NULL, self.value);

						break;
				}
			}
		};

		executor(resolve, reject);
	}

	Pledge.prototype = {
		state:  PLEDGE_PENDING,
		value:  NULL,
		then:   NULL
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

		function checkState() {
			if(countResolved === countTotal) {
				defered.resolve.apply(NULL, arrayPrototypeConcat.apply([], resolved));
			} else if(rejected.length + countResolved === countTotal) {
				defered.reject.apply(NULL, arrayPrototypeConcat.apply([], rejected));
			}
		}

		aPledges.forEach(function(aPledge, aIndex) {
			aPledge.then(
				function() {
					resolved[aIndex] = arrayPrototypeSlice.call(arguments);

					countResolved++;

					checkState();
				},
				function() {
					rejected.push(arrayPrototypeSlice.call(arguments));

					checkState();
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
				result = STORAGE_PREFIX + ' ' + self.message + ' ' + (self.module || '');

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
		items:   0,
		/**
		 * add an item to the queue
		 *
		 * @param {Loader} aLoader
		 */
		add: function(aLoader) {
			var self    = this,
				queue   = self.queue,
				handler = aLoader.handler;

			handler.onPreProcess && handler.onPreProcess(aLoader);

			queue.push(aLoader);

			self.items++;

			self.items === 1 && self.process();
		},
		/**
		 * process the queue
		 */
		process: function() {
			var self    = this,
				current = self.current,
				queue   = self.queue,
				defered, path, handler, result;

			if(current) {
				self.current = NULL;

				queue.shift();
				self.items--;
			}

			if(self.items) {
				current = self.current = self.queue[0];
				defered = current.defered;
				path    = current.path;
				handler = current.handler;

				handler.onPostProcess && handler.onPostProcess.call(current);

				if(current.probe && current.pledge.state === PLEDGE_PENDING) {
					if(result = current.probe()) {
						provide(function() { return result; });
					} else {
						defered.reject(new Error('probe failed for module', path));
					}
				}
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
			defered, pledge;

		resolve.path.call(self, aPath, aParent);

		defered = self.defered = defereds[self.type][self.path] || (defereds[self.type][self.path] = Pledge.defer());
		pledge  = self.pledge  = defered.pledge;

		aParent && pledge.then(NULL, log);

		demand(DEMAND_PREFIX_HANDLER + self.type)
			.then(
				self.process.bind(self),
				defered.reject
			);
	}

	Loader.prototype = {
		type:     NULL,
		version:  NULL,
		lifetime: NULL,
		path:     NULL,
		pledge:   NULL,
		handler:  NULL,
		url:      NULL,
		defered:  NULL,
		cached:   NULL,
		source:   NULL,
		timeout:  NULL,
		probe:    NULL,
		process: function(handler) {
			var self    = this,
				defered = self.defered,
				xhr;

			handler.onPreRequest && handler.onPreRequest.call(self);
			self.retrieve();

			self.handler = handler;
			self.probe   = probes[self.path];

			if(self.cached || !self.url) {
				queue.add(self);
			} else {
				xhr            = regexMatchUrl.test(self.url) ? new XHR() : new XDR();
				xhr.onprogress = FUNCTION_EMPTY;
				xhr.ontimeout  = xhr.onerror = xhr.onabort = function() { defered.reject(new Error('unable to load module', self.path)); };
				xhr.onload     = function() {
					self.timeout = clearTimeout(self.timeout);

					if(!('status' in xhr) || xhr.status === 200) {
						self.source = xhr.responseText;

						handler.onPostRequest && handler.onPostRequest.call(self);

						queue.add(self);
					} else {
						defered.reject(new Error('unable to load module', self.path));
					}
				};

				xhr.open('GET', addTimestamp(self.url), true);
				xhr.send();

				self.timeout = setTimeout(function() { if(xhr.readyState < 4) { xhr.abort(); } }, settings.timeout);
			}
		},
		/**
		 * store loaders result in localStorage
		 */
		store: function() {
			var self = this;

			settings.cache && self.source && storageAdapter.set(self);
		},
		/**
		 * retrieve cache for loader
		 */
		retrieve: function() {
			var self   = this,
				source, cached;

			if(self.url) {
				source = settings.cache && storageAdapter.get(self);
				cached = self.cached = !!(source);

				cached && (self.source = source);
			}
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
		var self = this,
			path, defered, pledge;

		resolve.path.call(self, aPath);

		path    = self.path;
		defered = defereds[self.type][path];
		pledge  = self.pledge = defered.pledge;

		pledge.then(NULL, function() { log(new Error('unable to resolve module', path, arguments));});

		if(aDependencies && aDependencies.length > 0) {
			demand
				.apply(self, aDependencies)
				.then(
					function() { defered.resolve(aDefinition.apply(NULL, arguments)); },
					function() { defered.reject(new Error('unable to resolve dependencies for', path, arguments)); }
				);
		} else {
			defered.resolve(aDefinition());
		}
	}

	Module.prototype = {
		type:   NULL,
		path:   NULL,
		pledge: NULL
	};

	// initialization
		// regex
			regexMatchUrl     = regex('^' + escape(resolve.url('/')));
			regexMatchLsState = regex('^' + escape(STORAGE_PREFIX + '\[(.+?)\]' + STORAGE_SUFFIX_STATE + '$'));

		// create queue
			queue = new Queue();

		// add pattern for "/demand" to point to original demand URL
			pattern['/' + DEMAND_ID] = new Pattern('/' + DEMAND_ID, resolve.url(((snippetParameter && snippetParameter.url) || location.href) + '/../').slice(0, -1));

		// configure
			configure(defaults) && snippetParameter && snippetParameter.settings && configure(snippetParameter.settings);

		// register in global scope
			demand.configure  = configure;
			demand.list       = function(state) {
				var keys = {},
					handler, kPointer, mPointer, path, pPointer;

				for(handler in modules) {
					if(state) {
						kPointer = keys[handler] = [];
						mPointer = modules[handler];

						for(path in mPointer) {
							pPointer = mPointer[path];

							if(pPointer.state === state || (pPointer.cache && pPointer.cache === state)) {
								kPointer.push(path);
							}
						}
					} else {
						keys[handler] = Object.keys(modules[handler]);
					}
				}

				return keys;
			};

			global.demand     = demand;
			global.provide    = provide;

		// register modules
			assign(DEMAND_PREFIX + 'pledge', Pledge);
			assign(DEMAND_PREFIX + 'function/resolve/url', resolve.url);
			assign(DEMAND_PREFIX + 'modifier/removeProtocol', removeProtocol);
			assign(DEMAND_PREFIX_VALIDATOR + 'isObject', isObject);
			assign(DEMAND_PREFIX_VALIDATOR + 'isTypeOf', isTypeOf);
			assign(DEMAND_PREFIX_VALIDATOR + 'isInstanceOf', isInstanceOf);
			assign(DEMAND_PREFIX_VALIDATOR + 'isPositiveInteger', isPositiveInteger);
			assign(DEMAND_PREFIX_STORAGE + defaults.storage, storageLocalstorage);
			assign(DEMAND_PREFIX_HANDLER + defaults.handler, handlerJavascript);

	// load main script
		demand(DEMAND_PREFIX_STORAGE + settings.storage)
			.then(
				function(adapter) {
					storageAdapter = adapter;
					demand.clear   = storageAdapter.clear;

					storageAdapter.clear.expired();

					if(snippetParameter && snippetParameter.main) {
						demand(snippetParameter.main);
					}
				}
			);
}(this, document, (function() { try { return 'localStorage' in this && localStorage; } catch(exception) { return false; } }()), JSON, XMLHttpRequest, setTimeout, clearTimeout, 'demand' in this && demand));