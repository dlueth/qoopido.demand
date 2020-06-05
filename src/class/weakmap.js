/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout
*/

var ClassWeakmap = 'WeakMap' in global && !('ActiveXObject' in global) ?
	global.WeakMap
	:
	(function(NativeWeakMap) {
		var weakmap = new NativeWeakMap();

		function WeakMap() {
			weakmap.set(this, new NativeWeakMap());
		}

		WeakMap.prototype = {
			get: function(key) {
				return weakmap.get(this).get(key);
			},
			set: function(key, value) {
				weakmap.get(this).set(key, value);

				return this;
			},
			has: function(key) {
				return !!this.get(key);
			},
			delete: function(key) {
				return weakmap.get(this).delete(key);
			}
		};

		return WeakMap;
	}(global.WeakMap));
