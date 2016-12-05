/* global global, document, demand, provide, settings */

/* constants */
	//=require constants.js
	/* global MODULE_PREFIX_HANDLER, EVENT_PRE_REQUEST, EVENT_POST_REQUEST, EVENT_PRE_PROCESS, NULL */

/* variables */
	//=require variables.js
	/* global regexMatchSourcemap, regexIsAbsoluteUri */

/* functions */
	//=require function/resolveUrl.js
	/* global resolveUrl */

/* classes */
	//=require class/singleton/event.js
	/* global event */
	
(function() {
	function definition() {
		var target         = document.getElementsByTagName('head')[0],
			resolver       = document.createElement('a'),
			regexMatchType = /^(application|text)\/(x-)?javascript/;
		
		demand
			.on(EVENT_PRE_REQUEST + ':module', function(loader) {
				var url = loader.url;
			
				loader.url = url.slice(-3) !== '.js' ? url + '.js' : url;
			})
			.on(EVENT_POST_REQUEST + ':module', function(loader) {
				var match, replacement;
				
				while(match = regexMatchSourcemap.exec(loader.source)) {
					if(regexIsAbsoluteUri.test(match[1])) {
						resolver.href = self.url;
						
						replacement = resolver.protocol + '//' + resolver.host + match[1];
					} else {
						replacement = resolveUrl(self.url + '/../' + match[1]);
					}
					
					loader.source = loader.source.replace(match[0], '//# sourceMappingURL=' + replacement + '.map');
				}

				event.emit(EVENT_PRE_PROCESS, NULL, loader);
			});
		
		return {
			validate: function(type) {
				return regexMatchType.test(type);
			},
			process: function(path, source) {
				var script;
				
				script       = document.createElement('script');
				script.async = true;
				script.text  = source;
					
				script.setAttribute('demand-path', path);
					
				target.appendChild(script);
			}
		};
	}
	
	provide(MODULE_PREFIX_HANDLER + 'module', definition);
}());