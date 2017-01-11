/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	EVENT_PRE_REQUEST, EVENT_POST_REQUEST, TRUE
	linkElement,
	regexMatchSourcemap, regexIsAbsoluteUri,
	functionResolveUrl,
	abstractHandler
*/

//=require constants.js
//=require shortcuts.js
//=require variables.js
//=require function/resolveUrl.js
//=require abstract/handler.js

var handlerModule = (function() {
	var target         = document.getElementsByTagName('head')[0],
		regexMatchType = /^(application|text)\/(x-)?javascript/;

	function HandlerModule() {}

	HandlerModule.prototype = {
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
				script.async = TRUE;
				script.text  = self.source;

				script.setAttribute('demand-id', self.id);

				target.appendChild(script);
			}
		}
	};

	return new (HandlerModule.extends(abstractHandler));
}());