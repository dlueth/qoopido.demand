/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	AbstractUuid
*/

//=require abstract/uuid.js

function ClassRegistry() {
	this.parent.constructor.call(this);

	storage[this.uuid] = {};
}

ClassRegistry.prototype = {
	get: function(key) {
		return key ? storage[this.uuid][key] : storage[this.uuid];
	},
	set: function(key, value) {
		storage[this.uuid][key] = value;
	}
};

ClassRegistry.extends(AbstractUuid);