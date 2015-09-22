/**
 * Qoopido.demand handler/json
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

;(function() {
	'use strict';

	function definition() {
		return {
			/**
			 * Enables modification of the URL that gets requested
			 *
			 * @this Loader
			 */
			onPreRequest: function() {
				var self = this,
					url  = self.url;

				self.url = url.slice(-5) !== '.json' ? url + '.json' : url;
			},
			/**
			 * handles processing of loaded JSON
			 *
			 * @this Loader
			 */
			onPostProcess: function() {
				var data = JSON.parse(this.source);

				provide(function() { return data; });
			}
		};
	}

	provide(definition);
}());