/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	EVENT_PRE_REQUEST, EVENT_POST_REQUEST,
	regexMatchSourcemap, regexIsAbsoluteUri,
	functionResolveUrl,
	singletonEvent
*/

//=require constants.js
//=require variables.js
//=require function/resolveUrl.js
//=require singleton/event.js

var handlerModule = (function() {
	var target         = document.getElementsByTagName('head')[0],
		resolver       = document.createElement('a'),
		regexMatchType = /^(application|text)\/(x-)?javascript/;

	return {
		validate: function(type) {
			return regexMatchType.test(type);
		},
		onPreRequest: function() {
			var self = this,
				url = self.url;

			self.url = url.slice(-3) !== '.js' ? url + '.js' : url;
		},
		onPostRequest: function() {
			var self = this,
				match, replacement;

			while(match = regexMatchSourcemap.exec(self.source)) {
				if(regexIsAbsoluteUri.test(match[1])) {
					resolver.href = self.url;

					replacement = resolver.protocol + '//' + resolver.host + match[1];
				} else {
					replacement = functionResolveUrl(self.url + '/../' + match[1]);
				}

				self.source = self.source.replace(match[0], '//# sourceMappingURL=' + replacement + '.map');
			}
		},
		process: function() {
			var self = this,
				script;
				
			script       = document.createElement('script');
			script.async = true;
			script.text  = self.source;
					
			script.setAttribute('demand-path', self.path);
					
			target.appendChild(script);
		}
	};
}());