/**
 * Qoopido.demand handler/text
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

	function definition() {
		return {
			process: function() {
				var self = this;

				provide(function() { return self.source; });
			}
		};
	}

	provide(definition);
}());