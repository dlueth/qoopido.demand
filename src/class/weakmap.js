/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	objectDefineProperty,
	AbstractUuid,
	ClassDescriptor
*/

//=require constants.js
//=require shortcuts.js
//=require abstract/uuid.js
//=require class/descriptor.js

var ClassWeakmap = 'WeakMap' in global ? global.WeakMap : (function() {
	var prefix = 'weakmap-';

	function ClassWeakmap() {
		return AbstractUuid.call(this);
	}

	ClassWeakmap.prototype = {
		set: function(key, value) {
			var entry;

			if((entry = key[this.uuid]) && entry[0] === key) {
				entry[1] = value;
			} else {
				objectDefineProperty(key, prefix + this.uuid, new ClassDescriptor([ key, value ]));
			}

			return this;
		},
		get: function(key) {
			var entry;

			if((entry = key[prefix + this.uuid]) && entry[0] === key) {
				return entry[1];
			}
		},
		delete: function(key) {
			var entry;

			if((entry = key[prefix + this.uuid])) {
				entry.length = 0;

				delete key[prefix + this.uuid];
			}
		},
		has: function(key) {
			var entry;

			return !!(entry = key[prefix + this.uuid]) && entry[0] === key;
		}
	};

	return ClassWeakmap.extends(AbstractUuid);
}());
