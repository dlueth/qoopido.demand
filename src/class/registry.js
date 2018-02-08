/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	ClassWeakmap
*/

//=require class/weakmap.js

var ClassRegistry = (function() {
	var storage = new ClassWeakmap();

	function ClassRegistry() {
		storage.set(this, {});
	}

	ClassRegistry.prototype = {
		get: function(key) {
			return key ? storage.get(this)[key] : storage.get(this);
		},
		set: function(key, value) {
			storage.get(this)[key] = value;
		},
		remove: function(key) {
			delete storage.get(this)[key];
		}
	};

	return ClassRegistry;
}());
