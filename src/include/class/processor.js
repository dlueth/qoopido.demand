/* global
	global, document, demand, provide, queue, processor, settings,
	EVENT_POST_PROCESS, EVENT_QUEUE_ENQUEUE, NULL,
	singletonUuid, singletonEvent
*/

var ClassProcessor = (function() {
	var storage = {};

	function Processor(queue) {
		var self    = this,
			pointer = storage[singletonUuid.set(self)] = { queue: queue, current: NULL };

		demand
			.on(EVENT_QUEUE_ENQUEUE + ':' + queue.uuid, function() {
				!pointer.current && self.process();
			});
	}

	Processor.prototype = {
		/* only for reference
		 uuid: NULL,
		 */
		process: function() {
			var pointer = storage[singletonUuid.set(this)],
				current;

			if(pointer.queue.length) {
				current = pointer.current = pointer.queue.dequeue();

				current.handler.process(current.path, current.source);

				singletonEvent.emit(EVENT_POST_PROCESS, current);
			} else {
				pointer.current = NULL;
			}
		},
		get current() {
			return storage[singletonUuid.set(this)].current;
		}
	};
	
	return Processor;
}());