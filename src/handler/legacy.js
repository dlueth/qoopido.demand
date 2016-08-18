/**
 * Qoopido.demand handler/legacy
 *
 * Copyright (c) 2016 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

(function(setTimeout) {
	'use strict';

	function definition(path, DemandError, handlerModule, isObject) {
		var settings;
		
		function onPostConfigure(options) {
			settings = isObject(options) ? options : {};
		}
		
		demand.on('postConfigure:' + path, onPostConfigure);
		
		function finalize() {
			var self  = this,
				probe = settings[self.path] && settings[self.path].probe,
				deferred, result;

			handlerModule.process.call(self);

			if(probe) {
				setTimeout(function() {
					deferred = self.deferred;

					if(deferred.pledge.state === 'pending') {
						if(result = probe()) {
							provide(function() { return result; });
						} else {
							deferred.reject(new DemandError('error probing', self.path));
						}
					}
				});
			}
		}

		return {
			matchType:     handlerModule.matchType,
			onPreRequest:  function() {
				var self         = this,
					deferred     = self.deferred,
					dependencies = settings[self.path] && settings[self.path].dependencies;

				if(dependencies) {
					self.dependencies = dependencies = demand.apply(null, dependencies).then(
						null,
						function() {
							deferred.reject(new DemandError('error resolving', self.path, arguments));
						}
					);
				}

				if(dependencies && self.mock) {
					self.mock.dependencies = dependencies;
				}

				handlerModule.onPreRequest.call(this);
			},
			onPostRequest: handlerModule.onPostRequest,
			process: function() {
				var self    = this,
					resolve = finalize.bind(self);
				
				if(self.dependencies) {
					self.dependencies.then(
						resolve,
						self.deferred.reject
					);
				} else {
					resolve();
				}
			}
		};
	}

	provide([ 'path', '/demand/error', '/demand/handler/module', '/demand/validator/isObject' ], definition);
}(setTimeout));