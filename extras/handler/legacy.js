(function() {
	'use strict';

	function definition(path, Failure, handlerModule, isObject) {
		var settings = {};

		demand
			.on('postConfigure:' + path, function(options) {
				settings = isObject(options) ? options : {};
			});

		function resolve() {
			var self     = this,
				deferred = self.deferred,
				probe    = settings[self.path] && settings[self.path].probe,
				result;

			handlerModule.process.call(self);

			if(probe && (result = probe())) {
				provide(function() { return result; });
			} else {
				deferred.reject(new Failure('error probing', self.path));
			}
		}

		return {
			validate: handlerModule.validate,
			onPreRequest: handlerModule.onPreRequest,
			onPostRequest: handlerModule.onPostRequest,
			onPreProcess: function() {
				var self         = this,
					dependencies = settings[self.path] && settings[self.path].dependencies;

				if(dependencies) {
					self.delay = demand.apply(null, dependencies);
				}
			},
			process: function() {
				var self         = this,
					boundResolve = resolve.bind(self);

				if(self.delay) {
					self.delay
						.then(
							boundResolve,
							function() {
								self.deferred.reject(new Failure('error resolving', self.path, arguments));
							}
						)
				} else {
					boundResolve();
				}
			}
		};
	}

	provide([ 'path', '/demand/failure', '/demand/handler/module', '/demand/validator/isObject' ], definition);
}());