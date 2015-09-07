/**
 * Qoopido.demand adapter for require.js
 *
 * Adapter for Qoopido.demand to enable loading of require.js compatible modules
 *
 * Copyright (c) 2015 Dirk Lueth
 *
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * @author Dirk Lueth <info@qoopido.com>
 */

;(function(global) {
	'use strict';

	/**
	 * definition of the require.js adapter
	 *
	 * @param {Function} demand
	 * @param {Function} provide
	 *
	 * @returns {{require: require, define: define}}
	 *
	 * @exports /adapter/require
	 */
	function definition(demand, provide) {
		/**
		 * provides require.js require functionality
		 *
		 * @param {...String} dependency
		 * @param {Function} callback
		 */
		function require() {
			var parameter    = arguments,
				dependencies = Array.isArray(parameter[0]) ? parameter[0] : null,
				callback     = arguments[dependencies ? 1 : 0];

			demand
				.apply(null, dependencies || [])
				.then(callback);
		}

		/**
		 * provides require.js define functionality
		 *
		 * @param {String} [id]
		 * @param {Object[]} [dependencies]
		 * @param {Function} definition
		 */
		function define() {
			var parameter    = arguments,
				id           = typeof parameter[0] === 'string' ? parameter[0] : null,
				dependencies = Array.isArray(parameter[id ? 1 : 0]) ? parameter[id ? 1 : 0] : null,
				definition   = parameter[id ? (dependencies ? 2 : 1) : (dependencies ? 1 : 0)],
				temp         = provide.apply(null, id ? [ id, definition ] : [ definition]);

			if(dependencies) {
				temp.when.apply(null, dependencies);
			}
		}

		define.amd = true;

		global.require = require;
		global.define  = define;

		return { require: require, define: define };
	}

	provide(definition)
		.when('/demand', '/provide');
}(this));