/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID, MODULE_PREFIX_HANDLER, ERROR_LOAD, DEMAND_ID, PROVIDE_ID, PATH_ID, MOCK_PREFIX, NULL, TRUE, FALSE,
	object,
	regexMatchInternal, regexMatchParameter,
	validatorIsPositive,
	functionResolvePath, functionResolveId, functionResolveUrl, functionIterate, functionToArray,
	ClassRegistry, ClassPledge, ClassFailure, ClassSemver,
	singletonCache
*/

//=require constants.js
//=require shortcuts.js
//=require variables.js
//=require validator/isPositive.js
//=require function/resolvePath.js
//=require function/resolveId.js
//=require function/resolveUrl.js
//=require function/iterate.js
//=require function/toArray.js
//=require class/registry.js
//=require class/pledge.js
//=require class/failure.js
//=require class/semver.js
//=require singleton/cache.js

var ClassDependency = (function() {
	var PREFIX_INTERNAL = 'internal!',
		registry        = new ClassRegistry(),
		placeholder     = [];

	function setProperty(property, value) {
		this[property] = value;
	}

	function addPending(id, dependency) {
		if(dependency.pledge.isPending()) {
			this.push(id);
		}
	}

	function addResolved(id, dependency) {
		if(dependency.pledge.isResolved()) {
			this.push(id);
		}
	}

	function addRejected(id, dependency) {
		if(dependency.pledge.isRejected()) {
			this.push(id);
		}
	}

	function ClassDependency(uri, context, register) {
		var self      = this,
			parameter = uri.match(regexMatchParameter) || placeholder;

		self.path     = functionResolvePath(uri, context);
		self.mock     = parameter[1] ? TRUE : FALSE;
		self.cache    = parameter[2] ? parameter[1] === '+' : NULL;
		self.type     = parameter[3] || settings.handler;
		self.version  = new ClassSemver(parameter[4] || settings.version);
		self.lifetime = (parameter[5] && parameter[5] * 1000) || settings.lifetime;
		self.id       = (self.mock ? MOCK_PREFIX : '' ) + self.type + '!' + self.path;
		self.uri      = (self.mock ? MOCK_PREFIX : '' ) + self.type + '@' + self.version + (validatorIsPositive(self.lifetime) && self.lifetime > 0 ? '#' + self.lifetime : '' ) + '!' + self.path;
		self.dfd      = ClassPledge.defer();
		self.pledge   = self.dfd.pledge;
		self.invalid  = false;

		self.pledge.then(function() {
			self.value = functionToArray(arguments);
		});

		(register !== FALSE) && registry.set(self.id, self);

		return self;
	}

	ClassDependency.prototype = {
		enqueue: true // handled by handler
		/* only for reference
	 	path:     NULL,
	 	mock:     NULL,
		cache:    NULL,
		type:     NULL,
		version:  NULL,
		lifetime: NULL,
	 	id:       NULL,
	 	uri:      NULL,
		dfd:      NULL,
		pledge:   NULL,
		value:    NULL,
		handler:  NULL, // set by Dependency.resolve
	 	source:   NULL, // set by Cache or Loader
	 	url:      NULL // optional, set by Loader
		*/
	};

	ClassDependency.get = function(uri, context) {
		return registry.get(functionResolveId(uri, context));
	};

	ClassDependency.resolve = function(uri, context) {
		var isInternal = context && regexMatchInternal.test(uri),
			dependency = isInternal ? this.get(PREFIX_INTERNAL + context + '/' + uri) : this.get(uri, context),
			value;

		if(!dependency) {
			if(isInternal) {
				dependency = new ClassDependency(PREFIX_INTERNAL + context + '/' + uri);

				switch(uri) {
					case DEMAND_ID:
						value = (function() {
							return functionIterate(demand, setProperty, demand.bind(context));
						}());

						break;
					case PROVIDE_ID:
						value = provide.bind(context);

						break;
					case PATH_ID:
						value = context;

						break;
				}

				dependency.dfd.resolve(value);
			} else {
				dependency = new ClassDependency(uri, context);

				demand(MODULE_PREFIX_HANDLER + dependency.type)
					.then(
						function(handler) {
							dependency.handler = handler;

							if(dependency.mock) {
								dependency.dfd.resolve(handler);
							} else {
								singletonCache.resolve(dependency);
							}
						},
						function() {
							dependency.dfd.reject(new ClassFailure(ERROR_LOAD + ' (handler)', self.id));
						}
					)
			}
		}

		return dependency;
	};

	ClassDependency.remove = function(uri, context, cache) {
		var id   = functionResolveId(uri, context),
			node = document.querySelector('[' + DEMAND_ID + '-id="' + id + '"]');

		registry.remove(id);
		registry.remove(MOCK_PREFIX + id);

		node && node.parentNode.removeChild(node);

		(cache !== FALSE) && singletonCache.clear(id);
	};

	ClassDependency.list = {
		all: function() {
			return object.keys(registry.get());
		},
		pending:  function() {
			return functionIterate(registry.get(), addPending, []);
		},
		resolved: function() {
			return functionIterate(registry.get(), addResolved, []);
		},
		rejected: function() {
			return functionIterate(registry.get(), addRejected, []);
		}
	};

	return ClassDependency;
}());
