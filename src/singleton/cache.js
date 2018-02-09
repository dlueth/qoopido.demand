/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID, FUNCTION_EMPTY, EVENT_POST_REQUEST, EVENT_POST_PROCESS, EVENT_CACHE_HIT, EVENT_CACHE_MISS, EVENT_CACHE_EXCEED, EVENT_CACHE_CLEAR, EVENT_PRE_CACHE, EVENT_PRE_CACHE, EVENT_POST_CACHE, STRING_STRING, NULL, FALSE, TRUE,
	validatorIsTypeOf,
	functionGetTimestamp, functionEscapeRegex, functionIterate, functionDefer, functionResolveId, functionToArray,
	ClassDependency,
	singletonEvent
*/

//=require constants.js
//=require validator/isTypeOf.js
//=require function/getTimestamp.js
//=require function/escapeRegex.js
//=require function/iterate.js
//=require function/defer.js
//=require function/resolveId.js
//=require function/toArray.js
//=require singleton/event.js

var singletonCache = (function() {
	var STORAGE_PREFIX         = '[' + DEMAND_ID + ']',
		STORAGE_SUFFIX_STATE   = '[state]',
		STORAGE_SUFFIX_VALUE   = '[value]',
		regexMatchState        = new RegExp('^' + functionEscapeRegex(STORAGE_PREFIX) + '\\[(.+?)\\]' + functionEscapeRegex(STORAGE_SUFFIX_STATE) + '$'),
		regexMatchProperties   = /^(.+?),(\d+),(\d*),(.+?),(\d+)$/,
		supportsLocalStorage   = (function() { try { return 'localStorage' in global && global.localStorage; } catch(exception) { return FALSE; } }()),
		localStorage           = supportsLocalStorage ? global.localStorage : NULL,
		supportsRemainingSpace = supportsLocalStorage && 'remainingSpace' in localStorage,
		storage                = {},
		cache;

	singletonEvent
		.on(EVENT_CACHE_MISS, function(dependency) {
			functionDefer(function() {
				cache.clear(dependency.id);
			});
		})
		.on(EVENT_CACHE_EXCEED, function(dependency) {
			demand('-!/' + DEMAND_ID + '/cache/dispose').then(function(cacheDispose) {
				functionDefer(function() {
					cacheDispose(dependency.source.length);

					cache.set(dependency);
				});
			});
		})
		.on(EVENT_POST_REQUEST, function(dependency) {
			if(dependency.source && enabled(dependency)) {
				storage[dependency.id] = TRUE;
			}
		})
		.after(EVENT_POST_PROCESS, function(dependency) {
			if(storage[dependency.id]) {
				functionDefer(function() {
					cache.set(dependency);
				});
			}
		});

	function enabled(dependency) {
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

	function getKey(key) {
		return localStorage.getItem(key);
	}

	function setKey(key, value) {
		localStorage[value ? 'setItem' : 'removeItem'](key, value);
	}

	function getState(key) {
		var state = getKey(key),
			matches;

		if(state && (matches = state.match(regexMatchProperties))) {
			return functionToArray(matches, 1);
		}
	}

	function setState(key, state) {
		state[4] = functionGetTimestamp();

		setKey(key, state.join(','));
	}

	function emit(event, dependency, state) {
		singletonEvent.emit(event, dependency.id, dependency, state);
	}

	function Cache() {
		functionDefer(this.clear.expired.bind(this.clear));
	}

	Cache.prototype = {
		get: supportsLocalStorage ? function(dependency) {
				var id, state;

				if(enabled(dependency)) {
					id    = STORAGE_PREFIX + '[' + dependency.id + ']';
					state = getState(id + STORAGE_SUFFIX_STATE);

					if(!state) {
						return;
					}

					if(state[0] !== dependency.version || (state[2] && dependency.lifetime && state[2] <= functionGetTimestamp())) {
						dependency.invalid = true;

						return;
					}

					dependency.source = getKey(id + STORAGE_SUFFIX_VALUE);

					functionDefer(function() {
						setState(id + STORAGE_SUFFIX_STATE, state);
					});

					return TRUE;
				}
			} : FUNCTION_EMPTY,
		resolve: supportsLocalStorage ? function(dependency) {
				var self = this;

				if(self.get(dependency)) {
					emit(EVENT_CACHE_HIT, dependency);
				} else {
					emit(EVENT_CACHE_MISS, dependency);
				}
			} : function(dependency) { emit(EVENT_CACHE_MISS, dependency); },
		set: supportsLocalStorage ? function(dependency) {
				var state, id, spaceBefore;

				if(enabled(dependency)) {
					state = [ dependency.version, dependency.source.length, dependency.lifetime ? functionGetTimestamp() + dependency.lifetime : NULL, demand.version ];
					id    = STORAGE_PREFIX + '[' + dependency.id + ']';

					emit(EVENT_PRE_CACHE, dependency, state);

					try {
						spaceBefore = supportsRemainingSpace ? localStorage.remainingSpace : NULL;

						setKey(id + STORAGE_SUFFIX_VALUE, dependency.source);
						setState(id + STORAGE_SUFFIX_STATE, state);

						// strict equality check with "===" is required due to spaceBefore might be "0"
						if(spaceBefore !== NULL && localStorage.remainingSpace === spaceBefore) {
							throw new Error();
						}

						emit(EVENT_POST_CACHE, dependency, state);
					} catch(error) {
						emit(EVENT_CACHE_EXCEED, dependency);
					}
				}
			} : FUNCTION_EMPTY,
		clear: supportsLocalStorage ? function(path) {
				var id  = functionResolveId(path),
					key = STORAGE_PREFIX + '[' + id + ']';

				if(getKey(key + STORAGE_SUFFIX_STATE)) {
					setKey(key + STORAGE_SUFFIX_STATE);
					setKey(key + STORAGE_SUFFIX_VALUE);

					emit(EVENT_CACHE_CLEAR, ClassDependency.get(id) || new ClassDependency(id, NULL, FALSE));
				}
			} : function() {}
	};

	Cache.prototype.clear.all = supportsLocalStorage ? function() {
			var match;

			functionIterate(localStorage, function(property) {
				match = property.match(regexMatchState);

				match && this(match[1]);
			}, this);
		} : FUNCTION_EMPTY;

	Cache.prototype.clear.expired = supportsLocalStorage ? function() {
			var match, state;

			functionIterate(localStorage, function(property) {
				match = property.match(regexMatchState);

				if(match) {
					state = getState(STORAGE_PREFIX + '[' + match[1] + ']' + STORAGE_SUFFIX_STATE);

					if(state && state[2] > 0 && state[2] <= functionGetTimestamp()) {
						this(match[1]);
					}
				}
			}, this);
		} : FUNCTION_EMPTY;

	return (cache = new Cache());
}());
