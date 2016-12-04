/* global global, document, demand, provide, settings */

/* classes */
	//=require class/singleton/uuid.js
	/* global uuid */

var Registry = (function() {
	var storage = {};

	function Registry() {
		var self = this;

		storage[uuid.set(self)] = {};
	}

	Registry.prototype = {
		get: function(key) {
			return storage[this.uuid][key];
		},
		set: function(key, value) {
			storage[this.uuid][key] = value;
		}
	};

	return Registry;
}());