/**
 * /demand/handler/bundle
 */
(function() {
	var path = MODULE_PREFIX_HANDLER + 'bundle',
		settings;
	
	function definition(handlerModule) {
		function onPostConfigure(options) {
			settings = isObject(options) ? options : {};
		}
		
		demand.on('postConfigure:' + path, onPostConfigure);

		return {
			matchType:     handlerModule.matchType,
			onPostRequest: handlerModule.onPostRequest,
			onPreProcess: function() {
				var self     = this,
					deferred = self.deferred,
					modules  = settings[self.path];

				console.log(self);

				mockModules.apply(NULL, modules)
					.then(
						function() {
							queue.enqueue.apply(queue, arguments);
							handlerModule.process.call(self);

							demand
								.apply(NULL, modules)
								.then(
									deferred.resolve,
									function() {
										deferred.reject(new Failure('error resolving', self.path, arguments));
									}
								);
						},
						function() {
							deferred.reject(new Failure('error mocking', NULL, arguments));
						}
					);
			}
		};
	}
	
	provide(path, [ '/demand/handler/module' ], definition);
}());