/* global
	global, document, demand, provide, queue, processor, settings,
	EVENT_PRE_REQUEST, EVENT_POST_REQUEST,
	regexMatchSourcemap, regexIsAbsoluteUri,
	functionResolveUrl
*/

var handlerModule = (function() {
	var target         = document.getElementsByTagName('head')[0],
		resolver       = document.createElement('a'),
		regexMatchType = /^(application|text)\/(x-)?javascript/;
		
	demand
		.on(EVENT_PRE_REQUEST + ':module', function(dependency) {
			var url = dependency.url;

			dependency.url = url.slice(-3) !== '.js' ? url + '.js' : url;
		})
		.on(EVENT_POST_REQUEST + ':module', function(dependency) {
			var match, replacement;
				
			while(match = regexMatchSourcemap.exec(dependency.source)) {
				if(regexIsAbsoluteUri.test(match[1])) {
					resolver.href = self.url;
						
					replacement = resolver.protocol + '//' + resolver.host + match[1];
				} else {
					replacement = functionResolveUrl(self.url + '/../' + match[1]);
				}

				dependency.source = dependency.source.replace(match[0], '//# sourceMappingURL=' + replacement + '.map');
			}
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
}());