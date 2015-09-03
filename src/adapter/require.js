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

	function definition(demand, provide) {
		function require() {
			var dependencies = Array.isArray(arguments[0]) ? arguments[0] : null,
				callback     = arguments[dependencies ? 1 : 0];

			demand
				.apply(null, dependencies || [])
				.then(callback);
		}

		function define() {
			var id           = typeof arguments[0] === 'string' ? arguments[0] : null,
				dependencies = Array.isArray(arguments[id ? 1 : 0]) ? arguments[id ? 1 : 0] : null,
				factory      = arguments[id ? (dependencies ? 2 : 1) : (dependencies ? 1 : 0)],
				temp         = provide.apply(null, id ? [ id, factory ] : [ factory]);

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