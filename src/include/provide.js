/* global 
	global, document, demand, provide, queue, processor, settings,
	STRING_STRING, STRING_FUNCTION, NULL,
	validatorIsTypeOf, validatorIsArray, functionLog,
	ClassDependency, ClassFailure
*/

global.provide = function provide() {
	var uri          = validatorIsTypeOf(arguments[0], STRING_STRING) ? arguments[0] : NULL,
		dependencies = validatorIsArray(arguments[uri ? 1 : 0]) ? arguments[uri ? 1 : 0] : NULL,
		definition   = dependencies ? arguments[uri ? 2 : 1] : arguments[uri ? 1 : 0],
		module, isFunction;

	if(!uri && processor.current) {
		uri = processor.current.uri;

		processor.process();
	}
	
	if(uri) {
		module     = new ClassDependency(uri);
		isFunction = validatorIsTypeOf(definition, STRING_FUNCTION);

		if(module.pledge.isPending()) {
			if(dependencies) {
				demand
					.apply(module.path, dependencies)
					.then(
						function() { functionLog('success'); },
						function() { functionLog('error'); }
					);
			} else {
				module.deferred.resolve(isFunction ? definition() : definition);
			}
		}
		
		/*
		path       = resolvePath(path, this);
		deferred   = registry[path] || (registry[path] = Pledge.defer());
		pledge     = deferred.pledge;
		isFunction = validatorIsTypeOf(definition, STRING_FUNCTION);
		
		if(pledge.isPending()) {
			if(dependencies) {
				demand
					.apply(path, dependencies)
					.then(
						function() { deferred.resolve(isFunction ? definition.apply(NULL, arguments) : definition); },
						function() { functionLog(new ClassFailure('error providing', path)); }
					);
			} else {
				deferred.resolve(isFunction ? definition() : definition);
			}
		}
		*/
	} else {
		throw new ClassFailure('unspecified anonymous provide');
	}
}