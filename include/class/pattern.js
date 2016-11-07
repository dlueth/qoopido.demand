var Pattern = (function() {
	function Pattern(pattern, url) {
		var self = this;
		
		self.weight       = pattern.length;
		self.url          = resolveUrl(url).replace(regexMatchTrailingSlash, '$1');
		self.matchPattern = createRegularExpression('^' + escapeRegularExpression(pattern));
		self.matchUrl     = createRegularExpression('^' + escapeRegularExpression(url));
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