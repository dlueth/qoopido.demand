var Loader = (function() {
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
							
							if(pledge.isPending()) {
								xhr = regexMatchBaseUrl.test(self.url) ? new XHR() : new XDR();
								
								xhr.onprogress = function() {};
								xhr.ontimeout = xhr.onerror = xhr.onabort = function() {
									deferred.reject(new Failure('timeout requesting', self.path));
								};
								xhr.onload = function() {
									var type = xhr.getResponseHeader && xhr.getResponseHeader('content-type');
									
									timeout = clearTimeout(timeout);
									
									if((!('status' in xhr) || xhr.status === 200) && (!type || !handler.matchType || handler.matchType.test(type))) {
										self.source = xhr.responseText;
										
										emit('postRequest', self);
										
										if(pledge.isPending()) {
											handler.onPostRequest && handler.onPostRequest.call(self);
											resolveLoader(self);
											
											if(self.cache !== false) {
												pledge.then(function() { storage.set(self); });
											}
										}
									} else {
										deferred.reject(new Failure('error requesting', self.path));
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
							resolveLoader(self);
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
	
	return Loader;
}());