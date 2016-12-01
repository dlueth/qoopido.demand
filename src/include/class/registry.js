/* global global, document, settings */

/* classes */
	//=require class/uuid.js
	/* global Uuid */

var Registry = (function() {
	var storage = {};

	function Registry() {
		var self = this;

		storage[Uuid.set(self)] = {};
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