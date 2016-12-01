/* global global, document, settings */

/* variables */
	//=require variables.js
	/* global regexIsAbsoluteUri */

/* functions */
	//=require function/iterate.js
	//=require function/resolveUrl.js
	/* global iterate, resolveUrl */

var Loader = (function() {
	function Loader(dependency) {
		var self = this,
			pattern;

		if(!regexIsAbsoluteUri.test(dependency.path)) {
			iterate(settings.pattern, function(property, value) {
				value.matches(dependency.path) && (!pattern || pattern.weight < value.weight) && (pattern = value);
			});
		}

		self.dependency = dependency;
		self.pattern    = pattern;
		self.url        = pattern ? resolveUrl(pattern.process(dependency.path)) : dependency.path;

		console.log('hier', self);
	}

	/* only for reference
	Loader.prototype = {
		dependency: NULL,
	 	pattern:    NULL
	};
	*/

	return Loader;
}());