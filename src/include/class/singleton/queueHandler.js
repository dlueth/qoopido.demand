/* global global, document, demand, provide, settings */

/* constants */
	//=require constants.js
	/* global EVENT_PRE_PROCESS, EVENT_POST_PROCESS, NULL */

/* classes */
	//=require class/queue.js
	//=require class/singleton/event.js
	/* global Queue, uuid, event */

var queueHandler = (function() {
	var queue   = new Queue(),
		current = NULL;

	function QueueHandler() {}

	QueueHandler.prototype = {
		process: function() {
			if(queue.length) {
				current = queue.dequeue();
				
				current.handler.process.call(current);
				event.emit(EVENT_POST_PROCESS, current);
			} else {
				current = NULL;
			}
		},
		get current() {
			return current;
		}
	};
	
	return new QueueHandler();
}());