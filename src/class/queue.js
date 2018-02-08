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
	var self = AbstractUuid.call(this);

	storage.set(self, []);

	return self;
}

ClassQueue.prototype = {
	enqueue: function() {
		storage.set(this, storage.get(this).concat(functionToArray(arguments)));

		singletonEvent.emit(EVENT_QUEUE_ENQUEUE, this.uuid);
	},
	dequeue: function() {
		singletonEvent.emit(EVENT_QUEUE_DEQUEUE, this.uuid);

		return storage.get(this).shift();
	},
	get current() {
		return storage.get(this)[0];
	},
	get length() {
		return storage.get(this).length;
	}
};

ClassQueue.extends(AbstractUuid);
