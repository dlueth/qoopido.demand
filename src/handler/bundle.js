/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	MODULE_PREFIX_HANDLER, EVENT_POST_CONFIGURE, ERROR_RESOLVE, MOCK_PREFIX, STRING_STRING, FALSE, TRUE,
	regexMatchParameter, regexMatchSourcemap,
	validatorIsTypeOf, validatorIsObject,
	functionIterate, functionResolveId,
	abstractHandler,
	ClassDependency, ClassPledge, ClassFailure,
	handlerModule
*/

//=require constants.js
//=require variables.js
//=require validator/isTypeOf.js
//=require validator/isObject.js
//=require function/iterate.js
//=require function/resolveId.js
//=require abstract/handler.js
//=require class/dependency.js
//=require class/pledge.js
//=require class/Failure.js
//=require handler/module.js

var handlerBundle = (function() {
	var path     = MODULE_PREFIX_HANDLER + 'bundle',
		settings = {};

	demand
		.on(EVENT_POST_CONFIGURE + ':' + path, function(options) {
			if(validatorIsObject(options)) {
				settings = options;

				functionIterate(settings, updateDependencies);
			}
		});

	function updateDependencies(uri, dependencies) {
		var i, dependency;

		for(i = 0; (dependency = dependencies[i]); i++) {
			if(validatorIsTypeOf(dependency, STRING_STRING)) {
				dependencies[i] = functionResolveId(dependency);
			}
		}
	}

	function getType(dependencies) {
		var type, i = 0, temp;

		for(; (temp = dependencies[i]); i++) {
			temp = temp.match(regexMatchParameter);
			temp = (temp && temp[3]) || settings.handler;

			if(type) {
				if(temp !== type) {
					return FALSE;
				}
			} else {
				type = temp;
			}
		}

		return type;
	}

	function HandlerBundle() {}

	HandlerBundle.prototype = {
		validate: handlerModule.validate,
		onPreProcess: function(dependency) {
			var source       = dependency.source,
				dfd          = dependency.dfd,
				dependencies = settings[dependency.path],
				type, match, pledges, temp, i;

			dependency.enqueue = FALSE;

			function reject() {
				dfd.reject(new ClassFailure(ERROR_RESOLVE, dependency.id, arguments));
			}

			if(dependencies && (type = getType(dependencies))) {
				while(match = regexMatchSourcemap.exec(source)) {
					source = source.replace(match[0], '');
				}

				dependency.source = source;
				pledges           = [];

				for(i = 0; (temp = dependencies[i]); i++) {
					pledges.push(ClassDependency.resolve(MOCK_PREFIX + temp).pledge);
				}

				ClassPledge.all(pledges).then(
					function() {
						pledges.length = 0;

						for(i = 0; (temp = dependencies[i]); i++) {
							temp         = dependencies[i] = ClassDependency.get(temp) || new ClassDependency(temp);
							temp.handler = arguments[i];

							pledges.push(temp.pledge);
						}

						if(type === 'module') {
							queue.enqueue.apply(queue, dependencies);
							handlerModule.process(dependency);
						} else {
							handlerModule.process(dependency);
							queue.enqueue.apply(queue, dependencies);
						}

						ClassPledge.all(pledges).then(dfd.resolve, reject);
					},
					reject
				);
			} else {
				reject();
			}
		}
	};

	return new (HandlerBundle.extends(abstractHandler));
}());