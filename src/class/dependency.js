/* global 
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	MODULE_PREFIX_HANDLER, ERROR_LOAD, DEMAND_ID, PROVIDE_ID, PATH_ID, MOCK_PREFIX, NULL, TRUE, FALSE,
	regexMatchInternal, regexMatchParameter,
	validatorIsPositive,
	functionResolvePath, functionResolveId, functionResolveUrl, functionIterate,
	ClassRegistry, ClassPledge, ClassFailure,
	singletonCache
*/

//=require constants.js
//=require variables.js
//=require validator/isPositive.js
//=require function/resolvePath.js
//=require function/resolveId.js
//=require function/resolveUrl.js
//=require function/iterate.js
//=require class/registry.js
//=require class/pledge.js
//=require class/failure.js
//=require singleton/cache.js

var ClassDependency = (function() {
	var PREFIX_INTERNAL = 'internal!',
		registry        = new ClassRegistry(),
		placeholder     = [];

	function ClassDependency(uri, context, register) {
		var self      = this,
			parameter = uri.match(regexMatchParameter) || placeholder;

		self.path     = functionResolvePath(uri, context);
		self.mock     = parameter[1] ? TRUE : FALSE;
		self.cache    = parameter[2] ? parameter[1] === '+' : NULL;
		self.type     = parameter[3] || settings.handler;
		self.version  = parameter[4] || settings.version;
		self.lifetime = (parameter[5] && parameter[5] * 1000) || settings.lifetime;
		self.id       = (self.mock ? MOCK_PREFIX : '' ) + self.type + '!' + self.path;
		self.uri      = (self.mock ? MOCK_PREFIX : '' ) + self.type + '@' + self.version + (validatorIsPositive(self.lifetime) && self.lifetime > 0 ? '#' + self.lifetime : '' ) + '!' + self.path;
		self.deferred = ClassPledge.defer();
		self.pledge   = self.deferred.pledge;

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
		deferred: NULL,
		pledge:   NULL,
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
			dependency = isInternal ? this.get(PREFIX_INTERNAL + context + '/' + uri) : this.get(uri, context);

		if(!dependency) {
			if(isInternal) {
				dependency = new ClassDependency(PREFIX_INTERNAL + context + '/' + uri);

				switch(uri) {
					case DEMAND_ID:
						dependency.deferred.resolve((function() {
							var scopedDemand = demand.bind(context);

							functionIterate(demand, function(property, value) {
								scopedDemand[property] = value;
							});

							return scopedDemand;
						}()));

						break;
					case PROVIDE_ID:
						dependency.deferred.resolve(provide.bind(context));

						break;
					case PATH_ID:
						dependency.deferred.resolve(context);

						break;
				}
			} else {
				dependency = new ClassDependency(uri, context);

				demand(MODULE_PREFIX_HANDLER + dependency.type)
					.then(
						function(handler) {
							dependency.handler = handler;

							if(dependency.mock) {
								dependency.deferred.resolve(handler);
							} else {
								singletonCache.resolve(dependency);
							}
						},
						function() {
							dependency.deferred.reject(new ClassFailure(ERROR_LOAD + ' (handler)', self.id));
						}
					)
			}
		}

		return dependency;
	};

	ClassDependency.remove = function(uri, context, cache) {
		var id   = functionResolveId(uri, context),
			node = document.querySelector('[demand-id="' + id + '"]');

		registry.remove(id);
		registry.remove(MOCK_PREFIX + id);

		node && node.parentNode.removeChild(node);

		(cache !== FALSE) && singletonCache.clear.path(id);
	};

	ClassDependency.list = {
		all: function() {
			return Object.keys(registry.get());
		},
		pending:  function() {
			var modules = [];

			functionIterate(registry.get(), function(property, value) {
				if(value.pledge.isPending()) {
					modules.push(property);
				}
			});

			return modules;
		},
		resolved: function() {
			var modules = [];

			functionIterate(registry.get(), function(property, value) {
				if(value.pledge.isResolved()) {
					modules.push(property);
				}
			});

			return modules;
		},
		rejected: function() {
			var modules = [];

			functionIterate(registry.get(), function(property, value) {
				if(value.pledge.isRejected()) {
					modules.push(property);
				}
			});

			return modules;
		}
	};

	return ClassDependency;
}());