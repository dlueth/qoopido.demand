/* global
	global, document, demand, provide, queue, processor, settings,
	singletonUuid
*/

//=require singleton/uuid.js

var ClassRegistry = (function() {
	var storage = {};

	function ClassRegistry() {
		var self = this;

		storage[singletonUuid.set(self)] = {};
	}

	ClassRegistry.prototype = {
		get: function(key) {
			return key ? storage[this.uuid][key] : storage[this.uuid];
		},
		set: function(key, value) {
			storage[this.uuid][key] = value;
		}
	};

	return ClassRegistry;
}());