function emit(event) {
	var pointer = listener[event],
		parameter, i, callback;
	
	if(pointer) {
		parameter = arrayPrototypeSlice.call(arguments, 1);
		
		for(i = 0; (callback = pointer[i]); i++) {
			callback.apply(NULL, parameter);
		}
	}
}

function log(error) {
	/* eslint-disable no-console */
	if(!isTypeOf(console, 'undefined')) {
		console.error(error.toString());
	}
	/* eslint-enable no-console */
}

function assignModule(id, factory) {
	provide(id, function() { return factory; });
}

function mockModules() {
	var pledges = [],
		i = 0, module, pledge, parameter;
	
	for(; (module = arguments[i]); i++) {
		parameter    = module.match(regexMatchParameter);
		module       = module.replace(regexMatchParameter, '');
		pledge       = (mocks[module] || (mocks[module] = Pledge.defer())).pledge;
		arguments[i] = (parameter ? 'mock:' + parameter.slice(1).join('')  : 'mock:') + '!' + module;
		
		pledges.push(pledge);
	}
	
	demand.apply(NULL, arguments);
	
	return Pledge.all(pledges);
}

function escapeRegularExpression(value) {
	return value.replace(regexMatchRegex, '\\$&');
}

function createRegularExpression(expression, modifier) {
	return new RegExp(expression, modifier);
}

function getTimestamp() {
	return +new Date();
}

function resolveUrl(url) {
	resolver.href = url;
	
	return resolver.href;
}

function resolvePath(path, context) {
	path = path.replace(regexMatchParameter, '');
	
	if(!regexIsAbsolutePath.test(path) && !regexIsAbsoluteUri.test(path)) {
		path = '/' + resolveUrl(((context && resolveUrl(context + '/../')) || '/') + path).replace(regexMatchBaseUrl, '');
	}
	
	return path;
}

function resolveDependency(dependency, context) {
	var path, definition, deferred;
	
	if(isTypeOf(dependency, STRING_STRING)) {
		path = resolvePath(dependency, context);
		
		if(context && (dependency === DEMAND_ID || dependency === PROVIDE_ID || dependency === PATH_ID)) {
			switch(dependency) {
				case DEMAND_ID:
					path       = MODULE_PREFIX_LOCAL + path;
					definition = function() {
						var scopedDemand = demand.bind(context);
						
						iterate(demand, function(property, value) {
							scopedDemand[property] = value;
						});
						
						return scopedDemand;
					};
					
					break;
				case PROVIDE_ID:
					path       = MODULE_PREFIX_LOCAL + path;
					definition = function() {
						return provide.bind(context);
					};
					
					break;
				case PATH_ID:
					path       = MODULE_PREFIX_PATHS + context;
					definition = function() {
						return context;
					};
					
					break;
			}
			
			!registry[path] && provide(path, definition);
		}
		
		return (registry[path] || (registry[path] = new Loader(path, resolveParameter(dependency, context)))).pledge;
	} else {
		if(!isInstanceOf(dependency, Pledge)) {
			deferred = Pledge.defer();
			
			deferred.resolve(dependency);
			
			return deferred.pledge;
		} else {
			return dependency;
		}
	}
}

function resolveParameter(path, context) {
	var parameter = path.match(regexMatchParameter),
		pattern   = settings.pattern,
		match;
	
	path = resolvePath(path, context);
	
	if(!regexIsAbsoluteUri.test(path)) {
		iterate(pattern, function(property, value) {
			value.matches(path) && (!match || match.weight < value.weight) && (match = value);
		});
	}
	
	return {
		mock:     (parameter && parameter[1]) ? true : false,
		cache:    (parameter && parameter[2]) ? parameter[2] === '+' : NULL,
		handler:  (parameter && parameter[3]) || settings.handler,
		version:  (parameter && parameter[4]) || settings.version,
		lifetime: (parameter && parameter[5] && parameter[5] * 1000) || settings.lifetime,
		url:      match ? resolveUrl(match.process(path)) : path
	};
}

function resolveLoader(loader) {
	var handler = loader.handler;
	
	emit('preProcess', loader);
	
	if(loader.deferred.pledge.isPending()) {
		handler.onPreProcess && handler.onPreProcess.call(loader);
		handler.process && queue.add(loader);
	}
}

function mergeProperties(property, value) {
	var targetProperty = this[property],
		targetPropertyIsObject;
	
	if(value !== undefined) {
		if(isObject(value)) {
			targetPropertyIsObject = isObject(targetProperty);
			
			if(value.length !== undefined) {
				targetProperty = (targetPropertyIsObject && targetProperty.length !== undefined) ? targetProperty : [];
			} else {
				targetProperty = (targetPropertyIsObject && targetProperty.length === undefined) ? targetProperty : {};
			}
			
			this[property] = merge(targetProperty, value);
		} else {
			this[property] = value;
		}
	}
}