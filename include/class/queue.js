var Queue = (function() {
	var storage = {};
	
	function Queue() {
		Uuid.set(this);
		
		global.stack = storage[this.uuid] = { stack: [], current: NULL };
	}
	
	Queue.prototype = {
		/* only for reference
		 uuid:    NULL,
		 current: NULL,
		 */
		add: function() {
			var properties = storage[this.uuid];
			
			properties.stack = properties.stack.concat(arrayPrototypeSlice.call(arguments));
			
			!properties.current && this.process();
		},
		process: function() {
			var properties = storage[this.uuid],
				current;
			
			if(properties.stack.length) {
				current = properties.current = properties.stack.shift();
				
				current.handler.process.call(current);
				emit('postProcess', current);
			}
		},
		get current() {
			return storage[this.uuid].current;
		},
		set current(value) {
			console.log('hier', value);
			storage[this.uuid].current = value;
		},
		get items() {
			return storage[this.uuid].stack.length;
		}
	};
	
	return Queue;
}());