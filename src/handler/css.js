/**
 * Qoopido.demand handler text/css
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

	function definition(provide, resolveUrl) {
		return {
			/**
			 * Enables modification of the URL that gets requested
			 *
			 * @param {String} aUrl
			 *
			 * @returns {String}
			 */
			prepare: function(aUrl) {
				return aUrl + '.css';
			},
			/**
			 * handles resolving of CSS modules
			 *
			 * @param {String} aPath
			 * @param {String} aValue
			 */
			resolve: function(aPath, aValue) {
				var style = document.createElement('style'),
					sheet = style.styleSheet;

				style.type  = 'text/css';
				style.media = 'only x';
				(sheet && (sheet.cssText = aValue)) || (style.innerHTML = aValue);

				style.setAttribute('demand-path', aPath);

				target.appendChild(style);

				setTimeout(function() {
					provide(function() { return style; });
				});
			},
			/**
			 * handles modifying of CSS module's source prior to caching
			 *
			 * Rewrites relative CSS URLs to an absolute URL in relation to the URL the module was loaded from
			 *
			 * @param {String} aUrl
			 * @param {String} aValue
			 *
			 * @returns {String}
			 */
			modify: function(aUrl, aValue) {
				var base = resolveUrl(aUrl + '/..'),
					match;

				while((match = regexMatchCssUrl.exec(aValue))) {
					aValue = aValue.replace(match[0], 'url(' + resolveUrl(base + match[1]) + ')');
				}

				return aValue;
			}
		};
	}

	provide(definition)
		.when('/provide', '/resolve/url');
}(document, setTimeout));