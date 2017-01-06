/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	functionResolveUrl, functionEscapeRegex, functionIterate
*/

//=require function/resolveUrl.js
//=require function/escapeRegex.js
//=require function/iterate.js

var ClassPattern = (function() {
	var regexMatchTrailingSlash = /(.+)\/$/;

	function ClassPattern(pattern, url) {
		var self = this;

		self.weight   = pattern.length;
		self.match    = new RegExp('^' + functionEscapeRegex(pattern));
		self.location = [].concat(url);

		functionIterate(self.location, function(property, value) {
			self.location[property] = {
				url:   functionResolveUrl(value).replace(regexMatchTrailingSlash, '$1'),
				match: new RegExp('^' + functionEscapeRegex(value))
			};
		});
	}

	ClassPattern.prototype = {
		/* only for reference
		 weight:   0,
		 match:    NULL,
		 location: NULL,
		 */
		matches: function(path) {
			return this.match.test(path);
		},
		process: function(path, index) {
			var current = this.location[index];

			if(current) {
				return path.replace(this.match, current.url);
			}
		}
	};

	return ClassPattern;
}());