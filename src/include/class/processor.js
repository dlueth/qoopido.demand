/* global
	global, document, demand, provide, queue, processor, settings,
	EVENT_POST_PROCESS, EVENT_QUEUE_ENQUEUE, NULL,
	singletonUuid, singletonEvent
*/

//=require constants.js
//=require singleton/uuid.js
//=require singleton/event.js

var ClassProcessor = (function() {
	var storage = {};

	function ClassProcessor(queue) {
		var self    = this,
			pointer = storage[singletonUuid.set(self)] = { queue: queue, current: NULL };

		singletonEvent
			.on(EVENT_QUEUE_ENQUEUE + ':' + queue.uuid, function() {
				!pointer.current && self.process();
			});
	}

	ClassProcessor.prototype = {
		/* only for reference
		 uuid: NULL,
		 */
		process: function() {
			var pointer = storage[singletonUuid.set(this)],
				current;

			if(pointer.queue.length) {
				current = pointer.current = pointer.queue.dequeue();

				current.handler.process.call(current);

				singletonEvent.emit(EVENT_POST_PROCESS, current.path, current);
			} else {
				pointer.current = NULL;
			}
		},
		get current() {
			return storage[singletonUuid.set(this)].current;
		}
	};
	
	return ClassProcessor;
}());