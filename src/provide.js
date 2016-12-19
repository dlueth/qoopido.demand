/* global 
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	STRING_STRING, STRING_UNDEFINED, STRING_FUNCTION, ERROR_PROVIDE, ERROR_PROVIDE_ANONYMOUS, NULL,
	validatorIsTypeOf, validatorIsArray,
	ClassDependency, ClassFailure
*/

//=require constants.js
//=require validator/isTypeOf.js
//=require validator/isArray.js
//=require class/dependency.js
//=require class/failure.js

global.provide = function provide() {
	var uri          = validatorIsTypeOf(arguments[0], STRING_STRING) ? arguments[0] : NULL,
		context      = this !== global ? this : NULL,
		dependencies = validatorIsArray(arguments[uri ? 1 : 0]) ? arguments[uri ? 1 : 0] : NULL,
		definition   = dependencies ? arguments[uri ? 2 : 1] : arguments[uri ? 1 : 0],
		module, isFunction;

	if(!uri && processor.current) {
		module = processor.current;
		uri    = module.uri;

		processor.process();
	}
	
	if(uri) {
		module     = module || new ClassDependency(uri, context);
		isFunction = validatorIsTypeOf(definition, STRING_FUNCTION);

		if(dependencies) {
			demand
				.apply(module.path, dependencies)
				.then(
					function() { module.deferred.resolve(isFunction ? definition.apply(NULL, arguments) : definition); },
					function() { module.deferred.reject(new ClassFailure(ERROR_PROVIDE, module.id, arguments)); }
				);
		} else {
			module.deferred.resolve(isFunction ? definition() : definition);
		}
	} else {
		/* eslint-disable no-console */
		!validatorIsTypeOf(console, STRING_UNDEFINED) && console.error(new ClassFailure(ERROR_PROVIDE_ANONYMOUS));
		/* eslint-enable no-console */
	}
};