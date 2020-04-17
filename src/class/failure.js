/* global
	global, document, demand, provide, queue, processor, settings, setTimeout, clearTimeout,
	DEMAND_ID,
	functionToArray
*/

//=require constants.js
//=require function/toArray.js

function ClassFailure(message, module, stack) {
	var self = this;

	self.message = message;

	module && (self.module = module);
	stack && (self.stack = functionToArray(stack));

	return self;
}

ClassFailure.prototype = {
	/* only for reference
	 message: NULL,
	 module:  NULL,
	 stack:   NULL,
	 */
	toString: function() {
		var self   = this,
			result = self.message + ' ' + (self.module ? '"' + self.module + '"' : '');

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
