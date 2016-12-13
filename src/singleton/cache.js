/* global 
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID, FUNCTION_EMPTY, EVENT_POST_PROCESS, EVENT_CACHE_HIT, EVENT_CACHE_MISS, EVENT_CACHE_EXCEED, EVENT_CACHE_CLEAR, EVENT_PRE_CACHE, EVENT_PRE_CACHE, EVENT_POST_CACHE, STRING_STRING, NULL, FALSE, TRUE,
	validatorIsTypeOf, validatorIsInstanceOf,
	functionGetTimestamp, functionEscapeRegex, functionIterate, functionDefer, functionResolveId,
	ClassDependency,
	singletonEvent
*/

//=require constants.js
//=require validator/isTypeOf.js
//=require validator/isInstanceOf.js
//=require function/getTimestamp.js
//=require function/escapeRegex.js
//=require function/iterate.js
//=require function/defer.js
//=require function/resolveId.js
//=require singleton/event.js

var singletonCache = (function(JSON) {
	var STORAGE_PREFIX         = '[' + DEMAND_ID + ']',
		STORAGE_SUFFIX_STATE   = '[state]',
		STORAGE_SUFFIX_VALUE   = '[value]',
		regexMatchState        = new RegExp('^' + functionEscapeRegex(STORAGE_PREFIX) + '\\[(.+?)\\]' + functionEscapeRegex(STORAGE_SUFFIX_STATE) + '$'),
		supportsLocalStorage   = (function() { try { return 'localStorage' in global && global.localStorage; } catch(exception) { return FALSE; } }()),
		supportsRemainingSpace = supportsLocalStorage && 'remainingSpace' in localStorage,
		cache;

	singletonEvent
		.on(EVENT_POST_PROCESS, function(dependency) {
			functionDefer(function() {
				dependency.source && cache.set(dependency);
			});
		})
		.on(EVENT_CACHE_MISS, function(dependency) {
			cache.clear.path(dependency.id);
		});

	function cachingEnabled(dependency) {
		var match;

		if(dependency.cache !== NULL) {
			return dependency.cache;
		}

		functionIterate(settings.cache, function(property, value) {
			if(dependency.path.indexOf(property) === 0 && (!match || value.weight > match.weight)) {
				match = value;
			}
		});

		return match ? match.state : FALSE;

	}

	function emit(event, dependency, state) {
		singletonEvent.emit(event, dependency.id, dependency, state);
	}

	function Cache() {}

	Cache.prototype = {
		get: (function() {
			if(supportsLocalStorage) {
				return function get(dependency) {
					var id, state;

					if(cachingEnabled(dependency)) {
						id    = STORAGE_PREFIX + '[' + dependency.id + ']';
						state = JSON.parse(localStorage.getItem(id + STORAGE_SUFFIX_STATE));

						if(state && state.version === dependency.version && ((!state.expires && !dependency.lifetime) || state.expires > functionGetTimestamp())) {
							dependency.source = localStorage.getItem(id + STORAGE_SUFFIX_VALUE);

							emit(EVENT_CACHE_HIT, dependency);
						} else {
							emit(EVENT_CACHE_MISS, dependency);
						}
					} else {
						emit(EVENT_CACHE_MISS, dependency);
					}
				};
			} else {
				return function get(dependency) {
					emit(EVENT_CACHE_MISS, dependency);
				};
			}
		}()),
		set: (function() {
			if(supportsLocalStorage) {
				return function set(dependency) {
					var state;

					if(cachingEnabled(dependency)) {
						state = { version: dependency.version, expires: dependency.lifetime ? functionGetTimestamp() + dependency.lifetime : dependency.lifetime };

						emit(EVENT_PRE_CACHE, dependency, state);

						functionDefer(function() {
							var id = STORAGE_PREFIX + '[' + dependency.id + ']',
								spaceBefore;

							try {
								spaceBefore = supportsRemainingSpace ? localStorage.remainingSpace : NULL;

								localStorage.setItem(id + STORAGE_SUFFIX_VALUE, dependency.source);
								localStorage.setItem(id + STORAGE_SUFFIX_STATE, JSON.stringify(state));

								// strict equality check with "===" is required due to spaceBefore might be "0"
								if(spaceBefore !== NULL && localStorage.remainingSpace === spaceBefore) {
									throw new Error('QUOTA_EXCEEDED_ERR');
								}

								emit(EVENT_POST_CACHE, dependency, state);
							} catch(error) {
								emit(EVENT_CACHE_EXCEED, dependency);
							}
						});
					}
				};
			} else {
				return FUNCTION_EMPTY;
			}
		}()),
		clear: {
			path: (function() {
				if(supportsLocalStorage) {
					return function path(path) {
						var id  = functionResolveId(path),
							key = STORAGE_PREFIX + '[' + id + ']';

						if(localStorage[key + STORAGE_SUFFIX_STATE]) {
							functionDefer(function() {
								localStorage.removeItem(key + STORAGE_SUFFIX_STATE);
								localStorage.removeItem(key + STORAGE_SUFFIX_VALUE);

								emit(EVENT_CACHE_CLEAR, ClassDependency.get(id) || new ClassDependency(id, NULL, FALSE));
							});
						}
					}
				} else {
					return FUNCTION_EMPTY;
				}
			}()),
			all: (function() {
				if(supportsLocalStorage) {
					return function all() {
						var match;

						functionIterate(localStorage, function(property) {
							match = property.match(regexMatchState);

							match && this.path(match[1]);
						}, this);
					}
				} else {
					return FUNCTION_EMPTY;
				}
			}()),
			expired: (function() {
				if(supportsLocalStorage) {
					return function expired() {
						var match, state;

						functionIterate(localStorage, function(property) {
							match = property.match(regexMatchState);

							if(match) {
								state = JSON.parse(localStorage.getItem(STORAGE_PREFIX + '[' + match[1] + ']' + STORAGE_SUFFIX_STATE));

								if(state && state.expires > 0 && state.expires <= functionGetTimestamp()) {
									this.path(match[1]);
								}
							}
						}, this);
					}
				} else {
					return FUNCTION_EMPTY;
				}
			}())
		}
	};

	return (cache = new Cache());
}(JSON));