/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	AbstractUuid
*/

//=require abstract/uuid.js

function ClassRegistry() {
	var self = AbstractUuid.call(this);

	storage[self.uuid] = {};
	
	return self;
}

ClassRegistry.prototype = {
	get: function(key) {
		return key ? storage[this.uuid][key] : storage[this.uuid];
	},
	set: function(key, value) {
		storage[this.uuid][key] = value;
	},
	remove: function(key) {
		delete storage[this.uuid][key];
	}
};

ClassRegistry.extends(AbstractUuid);