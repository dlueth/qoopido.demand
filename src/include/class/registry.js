/* global
	global, document, demand, provide, queue, processor, settings,
	singletonUuid
*/

var ClassRegistry = (function() {
	var storage = {};

	function Registry() {
		var self = this;

		storage[singletonUuid.set(self)] = {};
	}

	Registry.prototype = {
		get: function(key) {
			return key ? storage[this.uuid][key] : storage[this.uuid];
		},
		set: function(key, value) {
			storage[this.uuid][key] = value;
		}
	};

	return Registry;
}());