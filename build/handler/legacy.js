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
			onPreRequest: function() {
				var self         = this,
					dependencies = settings[self.path] && settings[self.path].dependencies;

				if(dependencies) {
					self.lock = demand.apply(null, dependencies);
				}

				handlerModule.onPreRequest.call(self);
			},
			onPostRequest: handlerModule.onPostRequest,
			process: function() {
				var self         = this,
					boundResolve = resolve.bind(self);

				if(self.lock) {
					self.lock
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