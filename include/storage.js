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