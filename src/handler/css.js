/**
 * Qoopido.demand handler/css
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

(function(document, setTimeout) {
	'use strict';

	var target              = document.getElementsByTagName('head')[0],
		resolver            = document.createElement('a'),
		regexMatchUrl       = /url\s*\(\s*["']?(.+?)["']?\s*\)/gi,
		regexMatchImport    = /@import\s+["'](.+?)["']/gi,
		regexMatchProtocol  = /http(s?):\/\//gi,
		regexIsAbsolutePath = /^\//i,
		regexIsAbsoluteUri  = /^data:|http(s?):|\/\//i;

	function resolveUrl(url) {
		resolver.href = url;

		return resolver;
	}

	function definition() {
		return {
			matchType: /^text\/css/,
			onPreRequest: function() {
				var self = this,
					url  = self.url;

				self.url = url.slice(-4) !== '.css' ? url + '.css' : url;
			},
			onPostRequest: function() {
				var self    = this,
					url     = resolveUrl(self.url + '/..'),
					base    = url.href,
					host    = '//' + url.host,
					source  = self.source,
					match;

				while((match = regexMatchUrl.exec(source))) {
					if(!regexIsAbsoluteUri.test(match[1])) {
						source = source.replace(match[0], 'url("' + resolveUrl(regexIsAbsolutePath.test(match[1]) ? host + match[1] : base + match[1]).href + '")');
					}
				}

				while((match = regexMatchImport.exec(source))) {
					if(!regexIsAbsoluteUri.test(match[1])) {
						source = source.replace(match[0], '@import "' + resolveUrl(regexIsAbsolutePath.test(match[1]) ? host + match[1] : base + match[1]).href + '"');
					}
				}

				source = source.replace(regexMatchProtocol, '//');

				self.source = source;
			},
			process: function() {
				var self   = this,
					style  = document.createElement('style'),
					source = self.source;

				style.type = 'text/css';

				if(style.styleSheet) {
					style.styleSheet.cssText = source;
				} else {
					style.innerHTML = source;
				}

				style.setAttribute('demand-path', self.path);

				target.appendChild(style);

				setTimeout(function() {
					provide(function() { return style; });
				});
			}
		};
	}

	provide(definition);
}(document, setTimeout));