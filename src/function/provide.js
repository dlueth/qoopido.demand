/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	EVENT_PROVIDE, EVENT_REJECT, STRING_STRING, STRING_UNDEFINED, STRING_FUNCTION, ERROR_PROVIDE, ERROR_PROVIDE_ANONYMOUS, NULL,
	validatorIsTypeOf, validatorIsInstanceOf, validatorIsArray,
	singletonEvent,
	ClassDependency, ClassFailure, ClassPledge
*/

//=require constants.js
//=require validator/isTypeOf.js
//=require validator/isInstanceOf.js
//=require validator/isArray.js
//=require singleton/event.js
//=require class/dependency.js
//=require class/failure.js
//=require class/pledge.js

/*eslint no-global-assign: [2, { "exceptions": ["provide"] }] */
provide = function provide() {
	var uri          = validatorIsTypeOf(arguments[0], STRING_STRING) ? arguments[0] : NULL,
		context      = this !== global ? this : NULL,
		dependencies = validatorIsArray(arguments[uri ? 1 : 0]) ? arguments[uri ? 1 : 0] : NULL,
		definition   = dependencies ? arguments[uri ? 2 : 1] : arguments[uri ? 1 : 0],
		module, isPledge, isFunction;

	if(!uri && processor.current) {
		module = processor.current;
		uri    = module.uri;

		processor.process();
	}

	if(uri) {
		module     = module || new ClassDependency(uri, context);
		isPledge   = validatorIsInstanceOf(definition, ClassPledge);
		isFunction = validatorIsTypeOf(definition, STRING_FUNCTION);

		if(dependencies) {
			demand
				.apply(module.path, dependencies)
				.then(
					function() { module.dfd.resolve(isFunction ? definition.apply(NULL, arguments) : definition); },
					function() { module.dfd.reject(new ClassFailure(ERROR_PROVIDE, module.id, arguments)); }
				);
		} else {
			if(isPledge) {
				definition.then(module.dfd.resolve, module.dfd.reject);
			} else {
				module.dfd.resolve(isFunction ? definition() : definition);
			}
		}

		module.dfd.pledge.then(
			function() { singletonEvent.emit(EVENT_PROVIDE, module.path, module); },
			function() { singletonEvent.emit(EVENT_REJECT, module.path, module); }
		);

		return module.dfd.pledge;
	} else {
		!validatorIsTypeOf(console, STRING_UNDEFINED) && console.error(new ClassFailure(ERROR_PROVIDE_ANONYMOUS)); // eslint-disable-line no-console
	}
};

global.define('provide', provide);
