/* global
	global, document, demand, provide, queue, processor, settings,
	functionResolveUrl, functionEscapeRegex
*/

//=require function/resolveUrl.js
//=require function/escapeRegex.js

var ClassPattern = (function() {
	var regexMatchTrailingSlash = /(.+)\/$/;

	function ClassPattern(pattern, url) {
		var self = this;

		self.weight       = pattern.length;
		self.url          = functionResolveUrl(url).replace(regexMatchTrailingSlash, '$1');
		self.matchPattern = new RegExp('^' + functionEscapeRegex(pattern));
		self.matchUrl     = new RegExp('^' + functionEscapeRegex(url));
	}

	ClassPattern.prototype = {
		/* only for reference
		 weight:       0,
		 url:          NULL,
		 matchPattern: NULL,
		 matchUrl:     NULL,
		 */
		matches: function(path) {
			return this.matchPattern.test(path);
		},
		remove: function(url) {
			return url.replace(this.matchUrl, '');
		},
		process: function(path) {
			return path.replace(this.matchPattern, this.url);
		}
	};

	return ClassPattern;
}());