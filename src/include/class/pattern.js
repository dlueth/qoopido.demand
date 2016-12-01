/* global global, document, settings */

/* constants */
	//=require constants.js
	/* global STRING_BOOLEAN, STRING_STRING, NULL */

/* shortcuts */
	//=require shortcuts.js
	/* global arrayPrototypeSlice */

/* functions */
	//=require function/resolveUrl.js
	//=require function/escapeRegularExpression.js
	/* global resolveUrl, escapeRegularExpression */

var Pattern = (function() {
	var regexMatchTrailingSlash = /(.+)\/$/;

	function Pattern(pattern, url) {
		var self = this;

		self.weight       = pattern.length;
		self.url          = resolveUrl(url).replace(regexMatchTrailingSlash, '$1');
		self.matchPattern = new RegExp('^' + escapeRegularExpression(pattern));
		self.matchUrl     = new RegExp('^' + escapeRegularExpression(url));
	}

	Pattern.prototype = {
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

	return Pattern;
}());