/* global global, document, demand, provide, settings */

/* shortcuts */
	//=require shortcuts.js
	/* global arrayPrototypeSlice */

/* classes */
	//=require class/singleton/uuid.js
	/* global uuid */
	
var Queue = (function() {
	var storage = {};
	
	function Queue() {
		uuid.set(this);
		
		storage[this.uuid] = [];
	}
	
	Queue.prototype = {
		/* only for reference
		 uuid: NULL,
		 */
		enqueue: function() {
			storage[this.uuid] = storage[this.uuid].concat(arrayPrototypeSlice.call(arguments));
		},
		dequeue: function() {
			return storage[this.uuid].shift();
		},
		get current() {
			return storage[this.uuid][0];
		},
		get length() {
			return storage[this.uuid].length;
		}
	};
	
	return Queue;
}());