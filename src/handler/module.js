/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	EVENT_PRE_REQUEST, EVENT_POST_REQUEST,
	linkElement,
	regexMatchSourcemap, regexIsAbsoluteUri,
	functionResolveUrl
*/

//=require constants.js
//=require shortcuts.js
//=require variables.js
//=require function/resolveUrl.js

var handlerModule = (function() {
	var target         = document.getElementsByTagName('head')[0],
		regexMatchType = /^(application|text)\/(x-)?javascript/;

	return {
		validate: function(type) {
			return regexMatchType.test(type);
		},
		onPreRequest: function() {
			var url = this.url;

			this.url = url.slice(-3) !== '.js' ? url + '.js' : url;
		},
		onPostRequest: function() {
			var self = this,
				match, replacement;

			while(match = regexMatchSourcemap.exec(self.source)) {
				if(regexIsAbsoluteUri.test(match[1])) {
					linkElement.href = self.url;

					replacement = linkElement.protocol + '//' + linkElement.host + match[1];
				} else {
					replacement = functionResolveUrl(self.url + '/../' + match[1]);
				}

				self.source = self.source.replace(match[0], '//# sourceMappingURL=' + replacement + '.map');
			}
		},
		process: function() {
			var self = this,
				script;

			if(self.source) {
				script       = document.createElement('script');
				script.async = true;
				script.text  = self.source;

				script.setAttribute('demand-id', self.id);

				target.appendChild(script);
			}
		}
	};
}());