/* global 
	global, document, demand, provide, queue, processor, settings,
	STRING_STRING, STRING_FUNCTION, ERROR_PROVIDE, ERROR_PROVIDE_ANONYMOUS, NULL,
	validatorIsTypeOf, validatorIsArray, functionLog,
	ClassDependency, ClassFailure
*/

global.provide = function provide() {
	var uri          = validatorIsTypeOf(arguments[0], STRING_STRING) ? arguments[0] : NULL,
		dependencies = validatorIsArray(arguments[uri ? 1 : 0]) ? arguments[uri ? 1 : 0] : NULL,
		definition   = dependencies ? arguments[uri ? 2 : 1] : arguments[uri ? 1 : 0],
		module, isFunction;

	if(!uri && processor.current) {
		module = processor.current;
		uri    = processor.current.uri;

		processor.process();
	}
	
	if(uri) {
		module     = module || new ClassDependency(uri);
		isFunction = validatorIsTypeOf(definition, STRING_FUNCTION);

		if(dependencies) {
			demand
				.apply(module.path, dependencies)
				.then(
					function() { module.deferred.resolve(isFunction ? definition.apply(NULL, arguments) : definition); },
					function() { functionLog(new ClassFailure(ERROR_PROVIDE, module.path)); }
				);
		} else {
			module.deferred.resolve(isFunction ? definition() : definition);
		}
	} else {
		throw new ClassFailure(ERROR_PROVIDE_ANONYMOUS);
	}
};