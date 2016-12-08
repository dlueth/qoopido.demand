/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	MODULE_PREFIX_HANDLER, EVENT_POST_CONFIGURE, ERROR_RESOLVE, MOCK_PREFIX, FALSE,
	regexMatchSourcemap,
	validatorIsObject,
	functionIterate,
	ClassDependency, ClassPledge, ClassFailure,
	handlerModule
*/

//=require constants.js
//=require variables.js
//=require validator/isObject.js
//=require function/iterate.js
//=require class/dependency.js
//=require class/pledge.js
//=require class/Failure.js
//=require handler/module.js

var handlerBundle = (function() {
	var path     = MODULE_PREFIX_HANDLER + 'bundle',
		settings = {};

	demand
		.on(EVENT_POST_CONFIGURE + ':' + path, function(options) {
			settings = validatorIsObject(options) ? options : {};
		});

	return {
		enqueue:  FALSE,
		validate: handlerModule.validate,
		onPreProcess: function() {
			var self     = this,
				source   = self.source,
				deferred = self.deferred,
				modules  = settings[self.path],
				match, pledges, dependency;

			while(match = regexMatchSourcemap.exec(source)) {
				source = source.replace(match[0], '');
			}

			function reject() {
				deferred.reject(new ClassFailure(ERROR_RESOLVE, self.path, arguments));
			}

			self.source = source;

			if(modules) {
				pledges = [];

				functionIterate(modules, function(property, value) {
					pledges.push(ClassDependency.resolve(MOCK_PREFIX + value).pledge);
				});

				ClassPledge.all(pledges).then(
					function() {
						pledges.length = 0;

						handlerModule.process.call(self);

						functionIterate(arguments, function(property, value) {
							dependency         = new ClassDependency(modules[property]);
							dependency.handler = value;

							queue.enqueue(dependency);
							processor.process();
							pledges.push(dependency.pledge);
						});

						ClassPledge.all(pledges).then(
							deferred.resolve,
							reject
						);
					},
					reject
				);
			}

		}
	};
}());