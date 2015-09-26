/**
 * Qoopido.demand handler/legacy
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

;(function(setTimeout) {
	'use strict';

	function definition(Reason, handlerModule, settings) {
		return {
			matchType:     handlerModule.matchType,
			onPreRequest:  function() {
				var self         = this,
					deferred     = self.deferred,
					dependencies = settings[self.path] && settings[self.path].dependencies;

				if(dependencies) {
					demand
						.apply(null, dependencies)
						.then(
							null,
							function() {
								deferred.reject(new Reason('error resolving', self.path, arguments));
							}
						);
				}

				handlerModule.onPreRequest.call(this);
			},
			onPostRequest: handlerModule.onPostRequest,
			process: function() {
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
								deferred.reject(new Reason('error probing', self.path));
							}
						}
					});
				}
			}
		};
	}

	provide([ '/demand/reason', '/demand/handler/module', 'settings' ], definition);
}(setTimeout));