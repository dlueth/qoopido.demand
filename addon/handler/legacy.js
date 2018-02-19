(function() {
	'use strict';

	function definition(path, Failure, handlerModule, isObject) {
		var settings = {};

		demand
			.on('postConfigure:' + path, function(options) {
				settings = isObject(options) ? options : {};
			});

		function resolve() {
			var self  = this,
				dfd   = self.dfd,
				probe = settings[self.path] && settings[self.path].probe,
				result;

			handlerModule.process(self);

			if(probe && (result = probe())) {
				provide(function() { return result; });
			} else {
				dfd.reject(new Failure('error probing', self.path));
			}
		}

		function HandlerLegacy() {}

		HandlerLegacy.prototype = {
			onPreRequest: function(dependency) {
				var dependencies = settings[dependency.path] && settings[dependency.path].dependencies;

				handlerModule.onPreRequest(dependency);

				if(dependencies) {
					dependency.enqueue = demand.apply(null, dependencies);
				}
			},
			onPreProcess: function(dependency) {
				var dependencies = settings[dependency.path] && settings[dependency.path].dependencies;

				if(dependencies && typeof dependency.enqueue === 'boolean') {
					dependency.enqueue = demand.apply(null, dependencies);
				}
			},
			process: function(dependency) {
				var boundResolve = resolve.bind(dependency);

				if(dependency.enqueue === true) {
					boundResolve();
				} else {
					dependency.enqueue
						.then(
							boundResolve,
							function() {
								dependency.dfd.reject(new Failure('error resolving', dependency.path, arguments));
							}
						)
				}
			}
		};

		return new (HandlerLegacy.extends(handlerModule));
	}

	provide([ 'path', '/demand/failure', '/demand/handler/module', '/demand/validator/isObject' ], definition);
}());