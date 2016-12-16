/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	MODULE_PREFIX_HANDLER, EVENT_POST_CONFIGURE, ERROR_RESOLVE, MOCK_PREFIX, STRING_STRING, FALSE, TRUE,
	regexMatchParameter, regexMatchSourcemap,
	validatorIsTypeOf, validatorIsObject,
	functionIterate, functionResolveId,
	ClassDependency, ClassPledge, ClassFailure,
	handlerModule
*/

//=require constants.js
//=require variables.js
//=require validator/isTypeOf.js
//=require validator/isObject.js
//=require function/iterate.js
//=require function/resolveId.js
//=require class/dependency.js
//=require class/pledge.js
//=require class/Failure.js
//=require handler/module.js

var handlerBundle = (function() {
	var path     = MODULE_PREFIX_HANDLER + 'bundle',
		settings = {};

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

	demand
		.on(EVENT_POST_CONFIGURE + ':' + path, function(options) {
			var i, dependency;

			settings = validatorIsObject(options) ? options : {};

			functionIterate(settings, function(uri, dependencies) {
				for(i = 0; (dependency = dependencies[i]); i++) {
					if(validatorIsTypeOf(dependency, STRING_STRING)) {
						dependencies[i] = functionResolveId(dependency);
					}
				}
			});
		});

	return {
		enqueue:  FALSE,
		validate: handlerModule.validate,
		onPreProcess: function() {
			var self         = this,
				source       = self.source,
				deferred     = self.deferred,
				dependencies = settings[self.path],
				type, match, pledges, dependency, i;

			function reject() {
				deferred.reject(new ClassFailure(ERROR_RESOLVE, self.id, arguments));
			}

			if(dependencies && (type = getType(dependencies))) {
				while(match = regexMatchSourcemap.exec(source)) {
					source = source.replace(match[0], '');
				}

				self.source = source;
				pledges     = [];

				for(i = 0; (dependency = dependencies[i]); i++) {
					pledges.push(ClassDependency.resolve(MOCK_PREFIX + dependency).pledge);
				}

				ClassPledge.all(pledges).then(
					function() {
						pledges.length = 0;

						for(i = 0; (dependency = dependencies[i]); i++) {
							dependency         = dependencies[i] = ClassDependency.get(dependency) || new ClassDependency(dependency);
							dependency.handler = arguments[i];

							pledges.push(dependency.pledge);
						}

						if(type === 'module') {
							queue.enqueue.apply(queue, dependencies);
							handlerModule.process.call(self);
						} else {
							handlerModule.process.call(self);
							queue.enqueue.apply(queue, dependencies);
						}

						ClassPledge.all(pledges).then(deferred.resolve, reject);
					},
					reject
				);
			} else {
				reject();
			}

		}
	};
}());