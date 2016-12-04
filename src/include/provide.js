/* global global, document, demand, provide, settings */

/* variables */
	//=require constants.js
	/* global NULL, STRING_STRING, STRING_FUNCTION */

/* variables */
	//=require variables.js
	/* global */

/* functions */
	//=require function/isTypeOf.js
	//=require function/isArray.js
	//=require function/log.js
	/* global isTypeOf, isArray, log */

/* classes */
	//=require class/dependency.js
	//=require class/failure.js
	/* global Dependency, Failure */

function provide() {
	var uri          = isTypeOf(arguments[0], STRING_STRING) ? arguments[0] : NULL,
		dependencies = isArray(arguments[uri ? 1 : 0]) ? arguments[uri ? 1 : 0] : NULL,
		definition   = dependencies ? arguments[uri ? 2 : 1] : arguments[uri ? 1 : 0],
		module, deferred, pledge, isFunction;
	
	/*
	if(!path && queueHandler.current) {
		path = queueHandler.current.path;
		
		queueHandler.process();
	}
	*/
	
	if(uri) {
		module     = new Dependency(uri);
		isFunction = isTypeOf(definition, STRING_FUNCTION);
		
		if(module.pledge.isPending()) {
			module.deferred.resolve(isFunction ? definition() : definition);
		}
		
		/*
		path       = resolvePath(path, this);
		deferred   = registry[path] || (registry[path] = Pledge.defer());
		pledge     = deferred.pledge;
		isFunction = isTypeOf(definition, STRING_FUNCTION);
		
		if(pledge.isPending()) {
			if(dependencies) {
				demand
					.apply(path, dependencies)
					.then(
						function() { deferred.resolve(isFunction ? definition.apply(NULL, arguments) : definition); },
						function() { log(new Failure('error providing', path)); }
					);
			} else {
				deferred.resolve(isFunction ? definition() : definition);
			}
		}
		*/
	} else {
		throw new Failure('unspecified anonymous provide');
	}
}