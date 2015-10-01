/**
 * Qoopido.demand handler/bundle
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

(function() {
	'use strict';

	function definition(mock, Reason, handlerModule, queue, settings) {
		return {
			matchType:     handlerModule.matchType,
			onPostRequest: handlerModule.onPostRequest,
			onPreProcess: function() {
				var self     = this,
					deferred = self.deferred,
					modules  = settings[self.path];

				mock(modules)
					.then(
						function() {
							queue.apply(null, arguments);
							handlerModule.process.call(self);

							demand
								.apply(null, modules)
								.then(
									deferred.resolve,
									function() {
										deferred.reject(new Reason('error resolving', self.path, arguments));
									}
								);
						},
						function() {
							deferred.reject(new Reason('error mocking', null, arguments));
						}
					);
			}
		};
	}

	provide([ '/demand/mock', '/demand/reason', '/demand/handler/module', '/demand/queue', 'settings' ], definition);
}());