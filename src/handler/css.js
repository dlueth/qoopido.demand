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

;(function(document, setTimeout) {
	'use strict';

	var target           = document.getElementsByTagName('head')[0],
		regexMatchCssUrl = /url\(\s*(?:"|'|)(?!data:|http:|https:|\/)(.+?)(?:"|'|)\)/g;

	function definition(resolveUrl) {
		return {
			matchType: /^text\/css/,
			/**
			 * Enables modification of the URL that gets requested
			 *
			 * @this Loader
			 */
			onPreRequest: function() {
				var self = this,
					url  = self.url;

				self.url = url.slice(-4) !== '.css' ? url + '.css' : url;
			},
			/**
			 * handles modifying of CSS module's source prior to caching
			 *
			 * Rewrites relative CSS URLs to an absolute URL in relation to the URL the module was loaded from
			 *
			 * @this Loader
			 */
			onPostRequest: function() {
				var self   = this,
					base   = resolveUrl(self.url + '/..'),
					source = self.source,
					match;

				while((match = regexMatchCssUrl.exec(source))) {
					source = source.replace(match[0], 'url(' + resolveUrl(base + match[1]) + ')');
				}

				self.source = source;
			},
			/**
			 * handles processing of loaded CSS modules
			 *
			 * @this Loader
			 */
			onPostProcess: function() {
				var self   = this,
					style  = document.createElement('style'),
					source = self.source;

				style.type  = 'text/css';
				style.media = 'only x';

				if(style.styleSheet) {
					style.styleSheet.cssText = source;
				} else {
					style.innerHTML = source;
				}

				style.setAttribute('demand-type', self.type);
				style.setAttribute('demand-path', self.path);

				target.appendChild(style);

				setTimeout(function() {
					provide(function() { return style; });
				});
			}
		};
	}

	provide(definition)
		.when('/demand/function/resolve/url');
}(document, setTimeout));