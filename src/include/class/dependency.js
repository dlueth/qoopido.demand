/* global global, document, settings */

/* global global, document, settings */

/* constants */
	//=require constants.js
	/* global NULL, TRUE, FALSE */

/* variables */
	//=require variables.js
	/* global regexIsAbsoluteUri */

/* functions */
	//=require function/isPositiveInteger.js
	//=require function/resolveUrl.js
	//=require function/escapeRegularExpression.js
	/* global isPositiveInteger, resolveUrl, escapeRegularExpression */

/* classes */
	//=require class/registry.js
	//=require class/pledge.js
	//=require class/cache.js
	/* global Registry, Pledge, cache */

var Dependency = (function() {
	var registry            = new Registry(),
		regexMatchParameter = /^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(\d+\.\d+.\d+))?(?:#(\d+))?!/,
		regexMatchBaseUrl   = new RegExp('^' + escapeRegularExpression(resolveUrl('/'))),
		regexIsAbsolutePath = /^\//;

	function resolvePath(uri, context) {
		var path = uri.replace(regexMatchParameter, '');

		if(!regexIsAbsolutePath.test(path) && !regexIsAbsoluteUri.test(path)) {
			path = '/' + resolveUrl(((context && resolveUrl(context + '/../')) || '/') + path).replace(regexMatchBaseUrl, '');
		}

		return path;
	}

	function Dependency(uri, context) {
		var self      = this,
			parameter = uri.match(regexMatchParameter);

		self.deferred = Pledge.defer();
		self.pledge   = self.deferred.pledge;
		self.path     = resolvePath(uri, context);
		self.mock     = (parameter && parameter[1]) ? TRUE : FALSE;
		self.cache    = (parameter && parameter[2]) ? parameter[2] === '+' : NULL;
		self.handler  = (parameter && parameter[3]) || settings.handler;
		self.version  = (parameter && parameter[4]) || settings.version;
		self.lifetime = (parameter && parameter[5] && parameter[5] * 1000) || settings.lifetime;
		self.uri      = (self.mock ? 'mock:' : '') + self.handler + '@' + self.version + (isPositiveInteger(self.lifetime) && self.lifetime > 0 ? '#' + self.lifetime : '' ) + '!' + self.path;

		cache.get(self);

		return self;
	}

	/* only for reference
	Dependency.prototype = {
		 deferred: NULL,
		 pledge:   NULL,
		 path:     NULL,
		 mock:     NULL,
		 cache:    NULL,
		 handler:  NULL,
		 version:  NULL,
		 lifetime: NULL,
		 uri:      NULL,
	};
	*/

	Dependency.resolve = function(uri, context) {
		var path       = resolvePath(uri, context),
			dependency = registry.get(path);

		if(!dependency) {
			dependency = new Dependency(uri, context);
		}

		return dependency.pledge;
	};

	return Dependency;
}());