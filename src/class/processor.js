/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	EVENT_QUEUE_ENQUEUE, NULL,
	singletonEvent,
	AbstractUuid
*/

//=require constants.js
//=require abstract/uuid.js

function ClassProcessor(queue) {
	var self    = this.parent.constructor.call(this),
		pointer = storage[self.uuid] = { queue: queue, current: NULL };

	demand
		.on(EVENT_QUEUE_ENQUEUE + ':' + queue.uuid, function() {
			!pointer.current && self.process();
		});
}

ClassProcessor.prototype = {
	process: function() {
		var pointer = storage[this.uuid],
				current;

		if(pointer.queue.length) {
			current = pointer.current = pointer.queue.dequeue();

			current.handler.process && current.handler.process(current);
		} else {
			pointer.current = NULL;
		}
	},
	get current() {
		return storage[this.uuid].current;
	}
};
	
ClassProcessor.extends(AbstractUuid);