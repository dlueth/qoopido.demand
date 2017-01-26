/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	EVENT_QUEUE_ENQUEUE, EVENT_QUEUE_DEQUEUE,
	functionToArray,
	singletonEvent,
	AbstractUuid
*/

//=require constants.js
//=require function/toArray.js
//=require singleton/event.js
//=require abstract/uuid.js

function ClassQueue() {
	this.parent.constructor.call(this);

	storage[this.uuid] = [];
}
	
ClassQueue.prototype = {
	enqueue: function() {
		storage[this.uuid] = storage[this.uuid].concat(functionToArray(arguments));

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
	
ClassQueue.extends(AbstractUuid);