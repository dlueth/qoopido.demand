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

;(function(global, document, localStorage, JSON, XMLHttpRequest, setTimeout, clearTimeout, snippetParameter, undefined) {
	'use strict';

	var arrayPrototype          = Array.prototype,
		arrayPrototypeSlice     = arrayPrototype.slice,
		arrayPrototypeConcat    = arrayPrototype.concat,
		objectPrototype         = Object.prototype,
		objectPrototypeToString = objectPrototype.toString,
		target                  = document.getElementsByTagName('head')[0],
		resolver                = document.createElement('a'),
		DEMAND_ID               = 'demand',
		PROVIDE_ID              = 'provide',
		SETTINGS_ID             = 'settings',
		MODULE_PREFIX           = '/' + DEMAND_ID + '/',
		MODULE_PREFIX_HANDLER   = MODULE_PREFIX + 'handler/',
		MODULE_PREFIX_LOCAL     = MODULE_PREFIX + 'local',
		MODULE_PREFIX_SETTINGS  = MODULE_PREFIX + 'settings',
		MODULE_PREFIX_VALIDATOR = MODULE_PREFIX + 'validator/',
		STORAGE_PREFIX          = '[' + DEMAND_ID + ']',
		STORAGE_SUFFIX_STATE    = '[state]',
		STORAGE_SUFFIX_VALUE    = '[value]',
		PLEDGE_PENDING          = 'pending',
		PLEDGE_RESOLVED         = 'resolved',
		PLEDGE_REJECTED         = 'rejected',
		STRING_STRING           = 'string',
		STRING_BOOLEAN          = 'boolean',
		NULL                    = null,
		XHR                     = XMLHttpRequest,
		XDR                     = 'XDomainRequest' in global &&  global.XDomainRequest || XHR,
		regexIsAbsolutePath     = /^\//,
		regexIsAbsoluteUri      = /^(http(s?):)?\/\//i,
		regexMatchTrailingSlash = /\/$/,
		regexMatchParameter     = /^(mock:)?(!)?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?(\+cookie)?!/,
		regexMatchProtocol      = /^http(s?):/i,
		regexMatchSourcemap     = /\/\/#\s+sourceMappingURL\s*=\s*(.+?)\.map/g,
		regexMatchRegex         = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
		hasRemainingSpace       = localStorage && 'remainingSpace' in localStorage,
		settings                = { cache: true, debug: false, cookie: false, timeout: 8 * 1000, pattern: {}, modules: {}, handler: 'module', storage: 'localstorage' },
		registry                = {},
		mocks                   = {},
		resolve, defaults, regexMatchBaseUrl, regexMatchState, queue, storage;

	function demand() {
		var self         = this !== window ? this : NULL,
			dependencies = arrayPrototypeSlice.call(arguments),
			i = 0, dependency;

		for(; (dependency = dependencies[i]) !== undefined; i++) {
			dependencies[i] = resolve.dependency(dependency, self);
		}

		return Pledge.all(dependencies);
	}

	function configure(parameter) {
		var cache    = parameter.cache,
			debug    = parameter.debug,
			cookie   = parameter.cookie,
			version  = parameter.version,
			timeout  = parameter.timeout,
			lifetime = parameter.lifetime,
			base     = parameter.base,
			pattern  = parameter.pattern,
			modules  = parameter.modules,
			key;

		settings.cache  = isTypeOf(cache, STRING_BOOLEAN)  ? cache  : settings.cache;
		settings.debug  = isTypeOf(debug, STRING_BOOLEAN)  ? debug  : settings.debug;
		settings.cookie = isTypeOf(cookie, STRING_BOOLEAN) ? cookie : settings.cookie;

		if(isTypeOf(version, STRING_STRING)) {
			settings.version = version;
		}

		if(isPositiveInteger(timeout)) {
			settings.timeout = Math.min(Math.max(timeout, 2), 12) * 1000;
		}

		if(isPositiveInteger(lifetime) && lifetime > 0) {
			settings.lifetime = lifetime * 1000;
		}

		if(isTypeOf(base, STRING_STRING)) {
			settings.pattern.base = new Pattern('', resolve.url(base.replace(regexMatchTrailingSlash, '')));
		}

		if(isObject(pattern)) {
			for(key in pattern) {
				key !== 'base' && (settings.pattern[key] = new Pattern(key, pattern[key]));
			}
		}

		if(isObject(modules)) {
			for(key in modules) {
				settings.modules[key] = modules[key];
			}
		}
	}

	function mock(modules) {
		var pledges = [],
			i = 0, module, parameter;

		for(; (module  = modules[i]) !== undefined; i++) {
			parameter  = module.match(regexMatchParameter);
			module     = module.replace(regexMatchParameter, '');
			modules[i] = (parameter ? 'mock:' + parameter.slice(1).join('')  : 'mock:') + '!' + module;

			pledges.push((mocks[module] = Pledge.defer()).pledge);
		}

		demand.apply(NULL, modules);

		return Pledge.all(pledges);
	}

	function list(state) {
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
	}

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
			path       = resolve.path(path, this);
			deferred   = registry[path] || (registry[path] = Pledge.defer());
			pledge     = deferred.pledge;
			isFunction = isTypeOf(definition, 'function');

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

	resolve = {
		url: function(url) {
			resolver.href = url;

			return resolver.href;
		},
		path: function(path, context) {
			path = path.replace(regexMatchParameter, '');

			if(!regexIsAbsolutePath.test(path) && !regexIsAbsoluteUri.test(path)) {
				path = '/' + resolve.url(((context && resolve.url(context + '/../')) || '/') + path).replace(regexMatchBaseUrl, '');
			}

			return path;
		},
		dependency: function(dependency, context) {
			var path = resolve.path(dependency, context),
				definition;

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
							return settings.modules[context] || NULL;
						};

						break;
				}

				!registry[path] && provide(path, definition);
			}

			return (registry[path] || (registry[path] = new Loader(path, resolve.parameter(dependency, context)))).pledge;
		},
		parameter: function(path, context) {
			var parameter = path.match(regexMatchParameter),
				pattern   = settings.pattern,
				key, match;

			path = resolve.path(path, context);

			if(!regexIsAbsoluteUri.test(path)) {
				for(key in pattern) {
					pattern[key].matches(path) && (!match || match.weight < pattern[key].weight) && (match = pattern[key]);
				}
			}

			return {
				mock:     (parameter && parameter[1]) ? true : false,
				cache:    (parameter && parameter[2]) ? false : settings.cache,
				handler:  (parameter && parameter[3]) || settings.handler,
				version:  (parameter && parameter[4]) || settings.version,
				lifetime: (parameter && parameter[5] && parameter[5] * 1000) || settings.lifetime,
				cookie:   (parameter && parameter[6]) ? true : settings.cookie,
				url:      match ? removeProtocol(resolve.url(match.process(path))) : path
			};
		}
	};

	defaults = {
		handler: {
			matchType: /^(application|text)\/javascript/,
			onPreRequest: function() {
				var self = this,
					url  = self.url;

				self.url = url.slice(-3) !== '.js' ? url + '.js' : url;
			},
			onPostRequest: function() {
				var self   = this,
					url    = self.url,
					source = self.source,
					match, replacement;

				if(source) {
					while(match = regexMatchSourcemap.exec(source)) {
						replacement = removeProtocol(resolve.url(url + '/../' + match[1]));
						source      = source.replace(match[0], '//# sourcemap=' + replacement + '.map');
					}

					self.source = source;
				}
			},
			process: function() {
				var self   = this,
					source = self.source,
					script;

				if(source) {
					script       = document.createElement('script');
					script.async = true;
					script.text  = source;

					script.setAttribute('demand-path', self.path);

					target.appendChild(script);
				}
			}
		},
		storage: {
			get: function(loader) {
				var path, id, state;

				if(localStorage) {
					path  = loader.path;
					id    = STORAGE_PREFIX + '[' + path + ']';
					state = JSON.parse(localStorage.getItem(id + STORAGE_SUFFIX_STATE));

					if(state && state.version === loader.version && state.url === loader.url && ((!state.expires && !loader.lifetime) || state.expires > getTimestamp())) {
						return localStorage.getItem(id + STORAGE_SUFFIX_VALUE);
					} else {
						defaults.storage.clear.path(path);
					}
				}
			},
			set: function(loader) {
				var path, lifetime, id, data, spaceBefore;

				if(localStorage) {
					path     = loader.path;
					lifetime = loader.lifetime;
					id       = STORAGE_PREFIX + '[' + path + ']';
					data     = JSON.stringify({ version: loader.version, expires: lifetime ? getTimestamp() + lifetime : lifetime, url: loader.url });

					try {
						spaceBefore = hasRemainingSpace ? localStorage.remainingSpace : NULL;

						localStorage.setItem(id + STORAGE_SUFFIX_VALUE, loader.source);
						localStorage.setItem(id + STORAGE_SUFFIX_STATE, data);

						// strict equality check with "===" is required due to spaceBefore might be "0"
						if(spaceBefore !== NULL && localStorage.remainingSpace === spaceBefore) {
							throw 'QUOTA_EXCEEDED_ERR';
						}

						if(loader.cookie) {
							setCookie(path, data, 'Fri, 31 Dec 9999 23:59:59 GMT');
						}
					} catch(error) {
						log('error caching "' + path + '"');
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

						setCookie(path, '', 'Thu, 01 Jan 1970 00:00:00 GMT');
					}
				},
				all: function() {
					var key, match;

					if(localStorage) {
						for(key in localStorage) {
							match = key.match(regexMatchState);

							if(match) {
								defaults.storage.clear.path(match[1]);
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
									defaults.storage.clear.path(match[1]);
								}
							}
						}
					}
				}
			}
		}
	};

	function log(message) {
		var type = (isInstanceOf(message, Reason)) ? 'error' : 'warn';

		/* jshint ignore:start */
		if(!isTypeOf(console, 'undefined') && (settings.debug || type !== 'warn')) {
			console[type](message.toString());
		}
		/* jshint ignore:end */
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

	function addTimestamp(url) {
		resolver.href = url;

		var value = resolver.search,
			param = DEMAND_ID + '[timestamp]=' + getTimestamp();

		resolver.search += (value && value !== '?') ? '&' + param : '?' + param;

		return resolver.href;
	}

	function removeProtocol(url) {
		return url.replace(regexMatchProtocol, '');
	}

	function setCookie(path, value, expiration) {
		document.cookie = DEMAND_ID + '[' + path + ']=' + encodeURIComponent(value) + '; expires=' + expiration + '; path=/';
	}

	function isArray(value) {
		return objectPrototypeToString.call(value) === '[object Array]';
	}

	function isObject(object) {
		return object && isTypeOf(object, 'object');
	}

	function isTypeOf(object, type) {
		return typeof object === type;
	}

	function isInstanceOf(object, module) {
		return object instanceof module;
	}

	function isPositiveInteger(value) {
		return isTypeOf(value, 'number') && isFinite(value) && Math.floor(value) === value && value >= 0;
	}

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

			return self;
		};

		executor(resolve, reject);
	}

	Pledge.prototype = {
		state:  PLEDGE_PENDING,
		value:  NULL,
		then:   NULL
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
			countResolved = 0;

		function checkState() {
			if(countResolved === countTotal) {
				deferred.resolve.apply(NULL, arrayPrototypeConcat.apply([], resolved));
			} else if(rejected.length + countResolved === countTotal) {
				deferred.reject.apply(NULL, arrayPrototypeConcat.apply([], rejected));
			}
		}

		pledges.forEach(function(pledge, index) {
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
		});

		return deferred.pledge;
	};

	Pledge.race = function(pledges) {
		var deferred = Pledge.defer();

		pledges.forEach(function(pledge) {
			pledge.then(
				deferred.resolve,
				deferred.reject
			);
		});

		return deferred.pledge;
	};

	function Pattern(pattern, url) {
		var self = this;

		self.weight       = pattern.length;
		self.url          = resolve.url(url);
		self.matchPattern = createRegularExpression('^' + escapeRegularExpression(pattern));
		self.matchUrl     = createRegularExpression('^' + escapeRegularExpression(url));
	}

	Pattern.prototype = {
		weight:       0,
		url:          NULL,
		matchPattern: NULL,
		matchUrl:     NULL,
		matches: function(path) {
			return this.matchPattern.test(path);
		},
		remove: function(url) {
			return url.replace(this.matchUrl, '');
		},
		process: function(path) {
			var self = this;

			return path.replace(self.matchPattern, self.url);
		}
	};

	function Reason(message, module, stack) {
		var self = this;

		self.message = message;

		module && (self.module = module);
		stack && (self.stack = arrayPrototypeSlice.call(stack));
	}

	Reason.prototype = {
		message: NULL,
		module:  NULL,
		stack:   NULL,
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
		var indention = new Array(depth + 1).join(' ');

		stack.forEach(function(item) {
			value += '\n' + indention + '> ' + item.message + ' ' + (item.module ? '"' + item.module + '"' : '');

			if(item.stack) {
				value = Reason.traverse(item.stack, value, depth + 1);
			}
		});

		return value;
	};

	function Queue() {
		var self = this;

		self.items = 0;
		self.stack = [];
	}

	Queue.prototype = {
		items:   NULL,
		queue:   NULL,
		current: NULL,
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
			}
		}
	};

	function Loader(path, parameter) {
		var self     = this,
			deferred = Pledge.defer(),
			handler  = parameter.handler,
			xhr, timeout;

		self.deferred = deferred;
		self.path     = path;
		self.url      = parameter.url;
		self.cache    = parameter.cache;
		self.version  = parameter.version;
		self.lifetime = parameter.lifetime;
		self.cookie   = parameter.cookie;

		demand(MODULE_PREFIX_HANDLER + handler)
			.then(
				function(handler) {
					self.handler = handler;

					handler.onPreRequest && handler.onPreRequest.call(self);

					if(!parameter.mock) {
						if(!self.cache || !(self.source = storage.get(self))) {
							deferred.pledge.cache = 'miss';

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

									handler.onPostRequest && handler.onPostRequest.call(self);

									self.cache && storage.set(self);

									handler.onPreProcess && handler.onPreProcess.call(self);
									handler.process && queue.add(self);
								} else {
									deferred.reject(new Reason('error requesting', self.path));
								}
							};

							xhr.open('GET', addTimestamp(self.url), true);
							xhr.send();

							timeout = setTimeout(function() { if(xhr.readyState < 4) { xhr.abort(); } }, settings.timeout);
						} else {
							deferred.pledge.cache = 'hit';

							setTimeout(function() {
								handler.onPreProcess && handler.onPreProcess.call(self);
								handler.process && queue.add(self);
							});
						}
					} else {
						mocks[self.path].resolve(self);
					}
				},
				deferred.reject
			);

		return deferred;
	}

	Loader.prototype = {
		deferred: NULL,
		path:     NULL,
		url:      NULL,
		handler:  NULL,
		source:   NULL,
		cache:    NULL,
		lifetime: NULL,
		version:  NULL,
		cookie:   NULL
	};

	regexMatchBaseUrl = createRegularExpression('^' + escapeRegularExpression(resolve.url('/')));
	regexMatchState   = createRegularExpression('^' + escapeRegularExpression(STORAGE_PREFIX) + '\\[(.+?)\\]' + escapeRegularExpression(STORAGE_SUFFIX_STATE) + '$');

	configure({ base: '/', pattern: { '/demand': resolve.url(((snippetParameter && snippetParameter.url) || location.href) + '/../').slice(0, -1)} });
	snippetParameter && snippetParameter.settings && configure(snippetParameter.settings);

	assign(MODULE_PREFIX + 'queue', (queue = new Queue()).add);
	assign(MODULE_PREFIX + 'pledge', Pledge);
	assign(MODULE_PREFIX + 'reason', Reason);
	assign(MODULE_PREFIX + 'handler/' + settings.handler, defaults.handler);
	assign(MODULE_PREFIX + 'storage/' + settings.storage, (storage = defaults.storage));
	assign(MODULE_PREFIX + 'function/resolveUrl', resolve.url);
	assign(MODULE_PREFIX + 'modifier/removeProtocol', removeProtocol);
	assign(MODULE_PREFIX_VALIDATOR + 'isArray', isArray);
	assign(MODULE_PREFIX_VALIDATOR + 'isObject', isObject);
	assign(MODULE_PREFIX_VALIDATOR + 'isTypeOf', isTypeOf);
	assign(MODULE_PREFIX_VALIDATOR + 'isInstanceOf', isInstanceOf);
	assign(MODULE_PREFIX_VALIDATOR + 'isPositiveInteger', isPositiveInteger);

	demand.configure = configure;
	demand.clear     = storage.clear;
	demand.mock      = mock;
	demand.list      = list;
	global.demand    = demand;
	global.provide   = provide;

	storage.clear.expired();

	if(snippetParameter && snippetParameter.main) {
		demand(snippetParameter.main);
	}
}(this, document, (function() { try { return 'localStorage' in this && localStorage; } catch(exception) { return false; } }()), JSON, XMLHttpRequest, setTimeout, clearTimeout, 'demand' in this && demand));