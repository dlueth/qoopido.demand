/* global global, document, demand, provide, settings */

/* constants */
	//=require constants.js
	/* global NULL */

/* classes */
	//=require class/singleton/uuid.js
	//=require class/singleton/event.js
	/* global uuid, event */

var queueHandler = (function() {
	var storage = {};
	
	function QueueHandler(queue) {
		storage[uuid.set(this)] = { queue: queue, current: NULL };
	}
	
	QueueHandler.prototype = {
		/* only for reference
		 uuid: NULL,
		 */
		process: function() {
			var properties = storage[this.uuid],
				queue      = properties.queue,
				current;
			
			if(queue.length) {
				current = properties.current = queue.dequeue();
				
				current.handler.process.call(current);
				event.emit('postProcess', current);
			} else {
				properties.current = NULL;
			}
		},
		get current() {
			return storage[this.uuid].current;
		}
	};
	
	return new QueueHandler();
}());