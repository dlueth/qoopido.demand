var currentQueueItem = NULL;

function processQueue() {
	if(queue.length) {
		currentQueueItem = queue.dequeue();

		currentQueueItem.handler.process.call(currentQueueItem);
		emit('postProcess', currentQueueItem);
	}
}

var Queue = (function() {
	var storage = {};

	function Queue() {
		Uuid.set(this);

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