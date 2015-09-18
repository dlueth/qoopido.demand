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

	var NULL         = null,
		arrayIsArray = Array.isArray;

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
	function definition() {
		/**
		 * provides require.js require functionality
		 *
		 * @param {...String} dependency
		 * @param {Function} callback
		 */
		function require() {
			var parameter    = arguments,
				dependencies = arrayIsArray(parameter[0]) ? parameter[0] : NULL,
				callback     = arguments[dependencies ? 1 : 0];

			if(dependencies) {
				demand
					.apply(NULL, dependencies)
					.then(callback);
			} else {
				callback();
			}
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
				id           = typeof parameter[0] === 'string' ? parameter[0] : NULL,
				dependencies = arrayIsArray(parameter[id ? 1 : 0]) ? parameter[id ? 1 : 0] : NULL,
				definition   = parameter[id ? (dependencies ? 2 : 1) : (dependencies ? 1 : 0)],
				temp         = provide.apply(NULL, id ? [ id, definition ] : [ definition]);

			if(dependencies) {
				temp.when.apply(NULL, dependencies);
			}
		}

		define.amd = 1;

		global.require = require;
		global.define  = define;

		return { require: require, define: define };
	}

	provide(definition);
}(this));