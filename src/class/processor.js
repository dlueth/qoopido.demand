/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout, storage,
	EVENT_QUEUE_ENQUEUE, NULL,
	singletonEvent,
	AbstractUuid
*/

//=require constants.js
//=require abstract/uuid.js

function ClassProcessor(queue) {
	var self    = AbstractUuid.call(this),
		pointer = storage[self.uuid] = { queue: queue, current: NULL };

	demand
		.on(EVENT_QUEUE_ENQUEUE + ':' + queue.uuid, function() {
			!pointer.current && self.process();
		});
	
	return self;
}

ClassProcessor.prototype = {
	process: function() {
		var pointer = storage[this.uuid],
			current;

		if(pointer.queue.length) {
			current = pointer.current = pointer.queue.dequeue();

			if(!current.pledge.isRejected()) {
        current.handler.process && current.handler.process(current);

        return;
			}
		}

		pointer.current = NULL;
	},
	get current() {
		return storage[this.uuid].current;
	}
};
	
ClassProcessor.extends(AbstractUuid);