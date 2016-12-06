/* global
	global, document, demand, provide, queue, processor, settings,
	DEMAND_ID,
	arrayPrototypeSlice
*/

var ClassFailure = (function() {
	function Failure(message, module, stack) {
		this.message = message;
		
		module && (this.module = module);
		stack && (this.stack = arrayPrototypeSlice.call(stack));
	}
	
	Failure.prototype = {
		/* only for reference
		 message: NULL,
		 module:  NULL,
		 stack:   NULL,
		 */
		toString: function() {
			var self   = this,
				result = DEMAND_ID + ': ' + self.message + ' ' + (self.module ? '"' + self.module + '"' : '');
			
			if(self.stack) {
				result = Failure.traverse(self.stack, result, 1);
			}
			
			return result;
		}
	};
	
	Failure.traverse = function(stack, value, depth) {
		var indention = new Array(depth + 1).join(' '),
			i = 0, item;
		
		for(; item = stack[i]; i++) {
			value += '\n' + indention + '> ' + item.message + ' ' + (item.module ? '"' + item.module + '"' : '');
			
			if(item.stack) {
				value = Failure.traverse(item.stack, value, depth + 1);
			}
		}
		
		return value;
	};
	
	return Failure;
}());