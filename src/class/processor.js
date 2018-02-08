/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	EVENT_QUEUE_ENQUEUE, NULL,
	singletonEvent,
	ClassWeakmap
*/

//=require constants.js
//=require class/weakmap.js

var ClassProcessor = (function() {
	var storage = new ClassWeakmap();

	function ClassProcessor(queue) {
		var self       = this,
			properties = { queue: queue, current: NULL };

		storage.set(self, properties);

		demand
			.on(EVENT_QUEUE_ENQUEUE + ':' + queue.uuid, function() {
				!properties.current && self.process();
			});
	}

	ClassProcessor.prototype = {
		process: function() {
			var properties = storage.get(this),
				current;

			if(properties.queue.length) {
				current = properties.current = properties.queue.dequeue();

				if(!current.pledge.isRejected()) {
					current.handler.process && current.handler.process(current);

					return;
				}
			}

			properties.current = NULL;
		},
		get current() {
			return storage.get(this).current;
		}
	};

	return ClassProcessor;
}());
