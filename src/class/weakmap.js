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

var ClassWeakMap = 'WeakMap' in global ? global.WeakMap : global.WeakMap = (function() {
	var prefix = 'weakmap-';

	function ClassWeakMap() {
		return AbstractUuid.call(this);
	}

	ClassWeakMap.prototype = {
		set: function(key, value) {
			var self = this,
				entry;

			if((entry = key[self.uuid]) && entry[0] === key) {
				entry[1] = value;
			} else {
				objectDefineProperty(key, prefix + self.uuid, new ClassDescriptor([ key, value ]));
			}

			return self;
		},
		get: function(key) {
			var entry;

			if((entry = key[prefix + self.uuid]) && entry[0] === key) {
				return entry[1];
			}
		},
		delete: function(key) {
			var entry;

			if((entry = key[prefix + self.uuid])) {
				entry.length = 0;
			}
		},
		has: function(key) {
			var entry;

			return !!(entry = key[prefix + self.uuid]) && entry[0] === key;
		}
	};

	return ClassWeakMap.extends(AbstractUuid);
}());
