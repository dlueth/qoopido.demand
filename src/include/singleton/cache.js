/* global 
	global, document, demand, provide, queue, processor, settings
	DEMAND_ID, FUNCTION_EMPTY, EVENT_CACHE_HIT, EVENT_CACHE_MISS, EVENT_CACHE_EXCEED, EVENT_CACHE_CLEAR, NULL, FALSE, TRUE,
	functionGetTimestamp, functionEscapeRegex, functionIterate,
	singletonEvent
*/

var singletonCache = (function(JSON) {
	var STORAGE_PREFIX         = '[' + DEMAND_ID + ']',
		STORAGE_SUFFIX_STATE   = '[state]',
		STORAGE_SUFFIX_VALUE   = '[value]',
		regexMatchState        = new RegExp('^' + functionEscapeRegex(STORAGE_PREFIX) + '\\[(.+?)\\]' + functionEscapeRegex(STORAGE_SUFFIX_STATE) + '$'),
		supportsLocalStorage   = (function() { try { return 'localStorage' in global && global.localStorage; } catch(exception) { return FALSE; } }()),
		supportsRemainingSpace = supportsLocalStorage && 'remainingSpace' in localStorage;

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

	function Cache() {}

	Cache.prototype = {
		get: (function() {
			if(supportsLocalStorage) {
				return function get(dependency) {
					var id, state;

					if(cachingEnabled(dependency)) {
						id    = STORAGE_PREFIX + '[' + dependency.path + ']';
						state = JSON.parse(localStorage.getItem(id + STORAGE_SUFFIX_STATE));

						if(state && state.version === dependency.version && state.url === dependency.url && ((!state.expires && !dependency.lifetime) || state.expires > functionGetTimestamp())) {
							singletonEvent.emit(EVENT_CACHE_HIT, dependency.path, dependency);

							return localStorage.getItem(id + STORAGE_SUFFIX_VALUE);
						} else {
							singletonEvent.emit(EVENT_CACHE_MISS, dependency.path, dependency);

							state && this.clear.path(dependency.path);
						}
					} else {
						singletonEvent.emit(EVENT_CACHE_MISS, dependency.path, dependency);
					}
				};
			} else {
				return function get(dependency) {
					singletonEvent.emit(EVENT_CACHE_MISS, dependency.path, dependency);
				};
			}
		}()),
		set: (function() {
			if(supportsLocalStorage) {
				return function set(dependency, source) {
					var id, spaceBefore;

					if(cachingEnabled(dependency)) {
						id = STORAGE_PREFIX + '[' + dependency.path + ']';

						try {
							spaceBefore = supportsRemainingSpace ? localStorage.remainingSpace : NULL;

							localStorage.setItem(id + STORAGE_SUFFIX_VALUE, source);
							localStorage.setItem(id + STORAGE_SUFFIX_STATE, JSON.stringify({ version: dependency.version, expires: dependency.lifetime ? functionGetTimestamp() + dependency.lifetime : dependency.lifetime, url: dependency.url }));

							// strict equality check with "===" is required due to spaceBefore might be "0"
							if(spaceBefore !== NULL && localStorage.remainingSpace === spaceBefore) {
								throw new Error('QUOTA_EXCEEDED_ERR');
							}

							return TRUE;
						} catch(error) {
							singletonEvent.emit(EVENT_CACHE_EXCEED, dependency.path, dependency);
						}
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
						var id = STORAGE_PREFIX + '[' + path + ']';

						localStorage.removeItem(id + STORAGE_SUFFIX_STATE);
						localStorage.removeItem(id + STORAGE_SUFFIX_VALUE);

						singletonEvent.emit(EVENT_CACHE_CLEAR, path);
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

	return new Cache();
}(JSON));