/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	functionUuid,
*/

//=require function/uuid.js

var ClassWeakmap = 'WeakMap' in global ? global.WeakMap : (function() {
	var prefix = 'weakmap-';

	function getEntry(context, key) {
		var entry;

		if((entry = key[context.id]) && entry[0] === key) {
			return entry;
		}
	}

	function ClassWeakmap() {
		this.define('id', prefix + functionUuid());
	}

	ClassWeakmap.prototype = {
		set: function(key, value) {
			var entry = getEntry(this, key);

			if(entry) {
				entry[1] = value;
			} else {
				key.define(this.id, [ key, value ]);
			}

			return this;
		},
		get: function(key) {
			var entry = getEntry(this, key);

			if(entry) {
				return entry[1];
			}
		},
		delete: function(key) {
			var entry = getEntry(this, key);

			if(entry) {
				entry.length = 0;

				delete key[this.id];
			}
		},
		has: function(key) {
			return !!getEntry(this, key);
		}
	};

	return ClassWeakmap;
}());
