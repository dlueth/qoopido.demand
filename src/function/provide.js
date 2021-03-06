/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, log,
	EVENT_PROVIDE, STRING_STRING, STRING_UNDEFINED, STRING_FUNCTION, ERROR_PROVIDE, ERROR_PROVIDE_ANONYMOUS, NULL, TRUE, FALSE,
	objectDefineProperty,
	validatorIsTypeOf, validatorIsArray, validatorIsThenable,
	singletonEvent,
	ClassDependency, ClassFailure, ClassPledge
*/

//=require constants.js
//=require shortcuts.js
//=require validator/isTypeOf.js
//=require validator/isArray.js
//=require validator/isThenable.js
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
		module, isThenable, isFunction, value;

	if(processor.current) {
		module = processor.current;
		uri    = module.uri;

		processor.process();
	}

	if(uri) {
		module     = module || new ClassDependency(uri, context);
		isThenable = validatorIsThenable(definition);
		isFunction = validatorIsTypeOf(definition, STRING_FUNCTION);

		if(dependencies && dependencies.length) {
			demand
				.apply(module.path, dependencies)
				.then(
					function() {
						if(isFunction) {
							try {
								value = definition.apply(NULL, arguments);

								// module.value is already set when when module used exports (e.g. UMD)
								if(!module.value && validatorIsThenable(value)) {
									value
										.then(
											module.dfd.resolve,
											function() { module.dfd.reject(new ClassFailure(ERROR_PROVIDE, module.id, arguments)); }
										);
								} else {
									module.dfd.resolve(module.value || value);
								}
							} catch(error) {
								console.error(error);
								module.dfd.reject(new ClassFailure(ERROR_PROVIDE, module.id, error));
							}
						} else {
							module.dfd.resolve(definition);
						}
					},
					function() { module.dfd.reject(new ClassFailure(ERROR_PROVIDE, module.id, arguments)); }
				);
		} else {
			if(isThenable) {
				definition.then(module.dfd.resolve, module.dfd.reject);
			} else {
				if(isFunction) {
					try {
						module.dfd.resolve(definition());
					} catch (error) {
						console.error(error);
						module.dfd.reject(new ClassFailure(ERROR_PROVIDE, module.id, error));
					}
				} else {
					module.dfd.resolve(definition);
				}
			}
		}

		module.dfd.pledge.then(
			function() { singletonEvent.emit(EVENT_PROVIDE, module.path, module); }
		);

		return module.dfd.pledge;
	} else {
		throw new Error(ERROR_PROVIDE_ANONYMOUS);
	}
};

provide.amd = TRUE;

objectDefineProperty(global, 'provide', { value: provide, configurable: FALSE, writable: FALSE });
