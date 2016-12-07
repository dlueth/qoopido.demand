/* global
	global, document, demand, provide, queue, processor, settings,
	EVENT_QUEUE_ENQUEUE, EVENT_QUEUE_DEQUEUE,
	arrayPrototypeSlice,
	singletonUuid, singletonEvent
*/

//=require constants.js
//=require shortcuts.js
//=require singleton/uuid.js
//=require singleton/event.js

var ClassQueue = (function() {
	var storage = {};
	
	function ClassQueue() {
		storage[singletonUuid.set(this)] = [];
	}
	
	ClassQueue.prototype = {
		/* only for reference
		 uuid: NULL,
		 */
		enqueue: function() {
			storage[this.uuid] = storage[this.uuid].concat(arrayPrototypeSlice.call(arguments));

			singletonEvent.emit(EVENT_QUEUE_ENQUEUE, this.uuid);
		},
		dequeue: function() {
			singletonEvent.emit(EVENT_QUEUE_DEQUEUE, this.uuid);

			return storage[this.uuid].shift();
		},
		get current() {
			return storage[this.uuid][0];
		},
		get length() {
			return storage[this.uuid].length;
		}
	};
	
	return ClassQueue;
}());