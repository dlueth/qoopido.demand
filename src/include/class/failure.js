/* global
	global, document, demand, provide, queue, processor, settings,
	DEMAND_ID,
	arrayPrototypeSlice
*/

//=require constants.js
//=require shortcuts.js

function ClassFailure(message, module, stack) {
	this.message = message;
		
	module && (this.module = module);
	stack && (this.stack = arrayPrototypeSlice.call(stack));
}
	
ClassFailure.prototype = {
	/* only for reference
	 message: NULL,
	 module:  NULL,
	 stack:   NULL,
	 */
	toString: function() {
		var self   = this,
			result = DEMAND_ID + ': ' + self.message + ' ' + (self.module ? '"' + self.module + '"' : '');

		if(self.stack) {
			result = ClassFailure.traverse(self.stack, result, 1);
		}
			
		return result;
	}
};
	
ClassFailure.traverse = function(stack, value, depth) {
	var indention = new Array(depth + 1).join(' '),
		i = 0, item;
		
	for(; item = stack[i]; i++) {
		value += '\n' + indention + '> ' + item.message + ' ' + (item.module ? '"' + item.module + '"' : '');
			
		if(item.stack) {
			value = ClassFailure.traverse(item.stack, value, depth + 1);
		}
	}
		
	return value;
};