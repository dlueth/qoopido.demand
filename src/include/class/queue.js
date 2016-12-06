/* global
	global, document, demand, provide, queue, processor, settings,
	EVENT_QUEUE_ENQUEUE, EVENT_QUEUE_DEQUEUE,
	arrayPrototypeSlice,
	singletonUuid, singletonEvent
*/

var ClassQueue = (function() {
	var storage = {};
	
	function Queue() {
		storage[singletonUuid.set(this)] = [];
	}
	
	Queue.prototype = {
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
	
	return Queue;
}());