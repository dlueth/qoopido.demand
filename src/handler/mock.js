/**
 * Qoopido.demand handler/mock
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
				this.url = null;
			}
		};
	}

	provide(definition);
}());