/**
 * Qoopido.demand handler/json
 *
 * Copyright (c) 2016 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

/* global provide */

(function() {
	'use strict';

	function definition() {
		return {
			matchType: /^application\/json/,
			onPreRequest: function() {
				var self = this,
					url  = self.url;

				self.url = url.slice(-5) !== '.json' ? url + '.json' : url;
			},
			process: function() {
				var data = JSON.parse(this.source);

				provide(function() { return data; });
			}
		};
	}

	provide(definition);
}());