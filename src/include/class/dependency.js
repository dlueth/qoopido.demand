/* global 
	global, document, demand, provide, queue, processor, settings,
	MODULE_PREFIX_HANDLER, ERROR_LOAD, DEMAND_ID, PROVIDE_ID, PATH_ID, NULL, TRUE, FALSE,
	regexMatchInternal, regexMatchParameter
	validatorIsPositive, functionResolvePath, functionResolveId, functionResolveUrl, functionIterate,
	ClassRegistry, ClassPledge, ClassFailure,
	singletonCache
*/

var ClassDependency = (function() {
	var registry = new ClassRegistry();

	demand.list = {
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

	function ClassDependency(uri, context) {
		var self      = this,
			parameter = uri.match(regexMatchParameter);

		self.deferred = ClassPledge.defer();
		self.pledge   = self.deferred.pledge;
		self.path     = functionResolvePath(uri, context);
		self.mock     = (parameter && parameter[1]) ? TRUE : FALSE;
		self.cache    = (parameter && parameter[2]) ? parameter[2] === '+' : NULL;
		self.type     = (parameter && parameter[3]) || settings.handler;
		self.version  = (parameter && parameter[4]) || settings.version;
		self.lifetime = (parameter && parameter[5] && parameter[5] * 1000) || settings.lifetime;
		self.id       = self.type + '!' + self.path;
		self.uri      = (self.mock ? 'mock:' : '') + self.type + '@' + self.version + (validatorIsPositive(self.lifetime) && self.lifetime > 0 ? '#' + self.lifetime : '' ) + '!' + self.path;

		registry.set(self.id, self);
		
		return self;
	}

	/* only for reference
	 ClassDependency.prototype = {
		deferred: NULL,
		pledge:   NULL,
		path:     NULL,
		mock:     NULL,
		cache:    NULL,
		type:     NULL,
		version:  NULL,
		lifetime: NULL,
		id:       NULL,
		uri:      NULL,
		handler:  NULL, // set by Dependency.resolve
	 	url:      NULL, // set by Loader
		source:   NULL, // set by Cache or Loader
	};
	*/

	ClassDependency.resolve = function(uri, context) {
		var dependency = registry.get(functionResolveId(uri, context));

		if(!dependency) {
			dependency = new ClassDependency(uri, context);

			if(context && regexMatchInternal.test(uri)) {
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
				demand(MODULE_PREFIX_HANDLER + dependency.type)
					.then(
						function(handler) {
							dependency.handler = handler;

							singletonCache.get(dependency);
						},
						function() {
							dependency.deferred.reject(new ClassFailure(ERROR_LOAD + ' (handler)', self.path));
						}
					)
			}
		}

		return dependency;
	};

	return ClassDependency;
}());